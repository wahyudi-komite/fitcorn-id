param(
  [string]$Path = ".",
  [string]$OutDir = "graphify-out",
  [switch]$KeepExistingSemantic
)

$ErrorActionPreference = "Stop"

$pythonFile = Join-Path $OutDir ".graphify_python"
if (Test-Path $pythonFile) {
  $python = (Get-Content $pythonFile -Raw).Trim()
} else {
  $python = "python"
}

$args = @("tools/graphify_run.py", $Path, "--out-dir", $OutDir)
if ($KeepExistingSemantic) {
  $args += "--keep-existing-semantic"
}

& $python @args
