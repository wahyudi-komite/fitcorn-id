from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import graphify.extract as gx
from networkx.readwrite import json_graph

from graphify.analyze import god_nodes, suggest_questions, surprising_connections
from graphify.benchmark import run_benchmark
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.detect import detect
from graphify.export import to_html, to_json
from graphify.extract import collect_files, extract
from graphify.report import generate


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Stable local graphify runner for Windows workspaces."
    )
    parser.add_argument("path", nargs="?", default=".", help="Corpus root to graphify")
    parser.add_argument(
        "--out-dir",
        default="graphify-out",
        help="Directory for graphify artifacts (default: graphify-out)",
    )
    parser.add_argument(
        "--keep-existing-semantic",
        action="store_true",
        help="Merge non-code nodes/semantic edges from an existing graph.json when no semantic fragment file exists.",
    )
    return parser.parse_args()


def relativize_source_files(payload: dict[str, Any], root: Path) -> None:
    for bucket in ("nodes", "edges", "hyperedges"):
        for item in payload.get(bucket, []):
            source = item.get("source_file")
            if not source:
                continue
            source_path = Path(source)
            if not source_path.is_absolute():
                continue
            try:
                item["source_file"] = str(source_path.resolve().relative_to(root))
            except ValueError:
                continue


def load_json_any(path: Path) -> dict[str, Any]:
    data = path.read_bytes()
    for encoding in ("utf-8", "utf-8-sig", "utf-16", "utf-16-le", "utf-16-be"):
        try:
            return json.loads(data.decode(encoding))
        except Exception:
            continue
    raise ValueError(f"Unable to decode JSON file: {path}")


def collect_code_files(detection: dict[str, Any]) -> list[Path]:
    code_files: list[Path] = []
    for file_name in detection.get("files", {}).get("code", []):
        path = Path(file_name)
        code_files.extend(collect_files(path) if path.is_dir() else [path])
    return code_files


def merge_unique_nodes(ast_nodes: list[dict[str, Any]], semantic_nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: list[dict[str, Any]] = []
    seen: set[str] = set()
    for node in ast_nodes + semantic_nodes:
        node_id = node.get("id")
        if not node_id or node_id in seen:
            continue
        seen.add(node_id)
        merged.append(node)
    return merged


def merge_payloads(ast_payload: dict[str, Any], semantic_payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "nodes": merge_unique_nodes(ast_payload.get("nodes", []), semantic_payload.get("nodes", [])),
        "edges": ast_payload.get("edges", []) + semantic_payload.get("edges", []),
        "hyperedges": ast_payload.get("hyperedges", []) + semantic_payload.get("hyperedges", []),
        "input_tokens": ast_payload.get("input_tokens", 0) + semantic_payload.get("input_tokens", 0),
        "output_tokens": ast_payload.get("output_tokens", 0) + semantic_payload.get("output_tokens", 0),
    }


def semantic_from_existing_graph(graph_path: Path) -> dict[str, Any]:
    if not graph_path.exists():
        return {"nodes": [], "edges": [], "hyperedges": [], "input_tokens": 0, "output_tokens": 0}

    data = json.loads(graph_path.read_text(encoding="utf-8"))
    nodes = data.get("nodes", [])
    edges = data.get("links", data.get("edges", []))
    hyperedges = data.get("hyperedges", [])
    code_ids = {node["id"] for node in nodes if node.get("file_type") == "code"}

    semantic_nodes = [node for node in nodes if node.get("file_type") != "code"]
    semantic_edges = [
        edge
        for edge in edges
        if edge.get("confidence") in ("INFERRED", "AMBIGUOUS")
        or (edge.get("source") not in code_ids and edge.get("target") not in code_ids)
    ]
    return {
        "nodes": semantic_nodes,
        "edges": semantic_edges,
        "hyperedges": hyperedges,
        "input_tokens": 0,
        "output_tokens": 0,
    }


def find_semantic_payload(out_dir: Path, keep_existing_semantic: bool) -> tuple[dict[str, Any], str]:
    candidates = [
        out_dir / ".graphify_semantic.json",
        out_dir / ".graphify_semantic_new.json",
        out_dir / ".graphify_cached.json",
    ]
    for candidate in candidates:
        if candidate.exists():
            return load_json_any(candidate), str(candidate.name)

    if keep_existing_semantic:
        return semantic_from_existing_graph(out_dir / "graph.json"), "graph.json(non-code preserved)"

    return {"nodes": [], "edges": [], "hyperedges": [], "input_tokens": 0, "output_tokens": 0}, "none"


def main() -> int:
    args = parse_args()
    root = Path(args.path).resolve()
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    # graphify's AST cache writes are fragile on Windows in this workspace.
    gx.save_cached = lambda *a, **k: None

    detection = detect(root)
    (out_dir / ".graphify_detect.json").write_text(json.dumps(detection, indent=2), encoding="utf-8")

    code_files = collect_code_files(detection)
    ast_payload = extract(code_files, cache_root=root) if code_files else {
        "nodes": [],
        "edges": [],
        "hyperedges": [],
        "input_tokens": 0,
        "output_tokens": 0,
    }
    relativize_source_files(ast_payload, root)
    (out_dir / ".graphify_ast.json").write_text(json.dumps(ast_payload, indent=2), encoding="utf-8")

    semantic_payload, semantic_source = find_semantic_payload(out_dir, args.keep_existing_semantic)
    relativize_source_files(semantic_payload, root)
    if semantic_source != "none":
        (out_dir / ".graphify_semantic.normalized.json").write_text(
            json.dumps(semantic_payload, indent=2),
            encoding="utf-8",
        )

    extraction = merge_payloads(ast_payload, semantic_payload)
    extraction["semantic_status"] = "loaded" if semantic_source != "none" else "skipped"
    extraction["semantic_source"] = semantic_source
    (out_dir / ".graphify_extract.json").write_text(json.dumps(extraction, indent=2), encoding="utf-8")

    graph = build_from_json(extraction)
    communities = cluster(graph) if graph.number_of_nodes() else {}
    cohesion = score_all(graph, communities) if communities else {}
    labels = {community_id: f"Community {community_id}" for community_id in communities}
    questions = suggest_questions(graph, communities, labels) if communities else []
    surprises = surprising_connections(graph, communities) if communities else []
    gods = god_nodes(graph) if graph.number_of_nodes() else []

    report = generate(
        graph,
        communities,
        cohesion,
        labels,
        gods,
        surprises,
        detection,
        {"input": extraction.get("input_tokens", 0), "output": extraction.get("output_tokens", 0)},
        str(root),
        suggested_questions=questions,
    )
    report += (
        "\n\n## Workflow Note\n\n"
        f"- Runner: `tools/graphify_run.py`\n"
        f"- Semantic source: `{semantic_source}`\n"
        "- This wrapper disables graphify AST cache writes to avoid Windows permission issues in this repo.\n"
        "- All intermediate JSON is normalized to UTF-8 so PowerShell and Python agree on encoding.\n"
        "- `graph.json` is overwritten intentionally with the latest successful run.\n"
    )
    (out_dir / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")

    to_json(graph, communities, str(out_dir / "graph.json"), force=True)
    to_html(graph, communities, str(out_dir / "graph.html"), community_labels=labels or None)

    analysis = {
        "communities": {str(key): value for key, value in communities.items()},
        "cohesion": {str(key): value for key, value in cohesion.items()},
        "community_labels": {str(key): value for key, value in labels.items()},
        "gods": gods,
        "surprises": surprises,
        "suggested_questions": questions,
        "audit": {
            "semantic_status": extraction["semantic_status"],
            "semantic_source": semantic_source,
        },
    }
    (out_dir / ".graphify_analysis.json").write_text(json.dumps(analysis, indent=2), encoding="utf-8")

    benchmark = run_benchmark(str(out_dir / "graph.json"), corpus_words=detection.get("total_words"))
    (out_dir / "benchmark.json").write_text(json.dumps(benchmark, indent=2), encoding="utf-8")

    summary = {
        "root": str(root),
        "code_files": len(code_files),
        "nodes": graph.number_of_nodes(),
        "edges": graph.number_of_edges(),
        "communities": len(communities),
        "semantic_status": extraction["semantic_status"],
        "semantic_source": semantic_source,
        "graph": str(out_dir / "graph.json"),
        "html": str(out_dir / "graph.html"),
        "report": str(out_dir / "GRAPH_REPORT.md"),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
