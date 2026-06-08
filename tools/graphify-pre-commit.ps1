param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

Set-Location $RepoRoot

$pythonCommand = Get-Command python -ErrorAction Stop
$python = $pythonCommand.Source

& $python -c "import graphify" | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "Python can run, but the 'graphify' package is not installed."
}

$outDir = Join-Path $RepoRoot "graphify-out"
if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

$pythonFile = Join-Path $outDir ".graphify_python"
Set-Content -Path $pythonFile -Value $python -Encoding ascii -NoNewline

Write-Host "[graphify] Refreshing graph artifacts before commit..."

& $python (Join-Path $RepoRoot "tools\graphify_run.py") $RepoRoot --out-dir $outDir --keep-existing-semantic
if ($LASTEXITCODE -ne 0) {
  throw "Graphify pre-commit refresh failed."
}
