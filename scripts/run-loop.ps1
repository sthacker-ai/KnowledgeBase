<#
.SYNOPSIS
  KnowledgeBase Continuous Processing Loop.
  Runs the full pipeline (import → extract → classify → courses → summary →
  graph → assets → podcasts) then waits before repeating.

  All pipeline steps are defined in pipeline-steps.js — the single source of
  truth shared with run-pipeline.js and scheduled-daily.js.

.PARAMETER Limit
  Number of tweets to import per cycle (default: 10).

.PARAMETER WaitMinutes
  Minutes to wait between cycles (default: 10).

.EXAMPLE
  # Run with defaults (10 tweets, 10 min wait):
  powershell -ExecutionPolicy Bypass -File scripts\run-loop.ps1

  # Run 15 tweets with 5 min wait:
  powershell -ExecutionPolicy Bypass -File scripts\run-loop.ps1 -Limit 15 -WaitMinutes 5

  # Start silently in the background (independent process):
  $kb = "c:\My stuff\My Vibe Coding Projects\Knowledge base"
  Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$kb\scripts\run-loop.ps1`" -Limit 15 -WaitMinutes 5" -WindowStyle Hidden
#>
param(
  [int]$Limit       = 10,
  [int]$WaitMinutes = 10
)

$kb  = Split-Path -Parent $PSScriptRoot
$log = Join-Path $kb "logs\run-loop.log"
Set-Location $kb

function Log($msg) {
  $line = "[$((Get-Date).ToString('dd-MM-yyyy HH:mm:ss'))] $msg"
  Write-Host $line
  Add-Content -Path $log -Value $line -Encoding UTF8
}

Log "============================================================"
Log "KnowledgeBase Loop  |  Limit=$Limit  WaitMinutes=$WaitMinutes"
Log "============================================================"

$cycle = 0
while ($true) {
  $cycle++
  Log "---- Cycle $cycle started ----"

  # All 8 steps (import → extract → classify → course → summary → graph → assets → podcasts)
  # are handled by run-pipeline.js which reads from pipeline-steps.js.
  # To change what runs, edit pipeline-steps.js only.
  Log "Running full pipeline for $Limit tweets..."
  node scripts/run-pipeline.js --limit $Limit 2>&1 | ForEach-Object {
    $line = "[$((Get-Date).ToString('dd-MM-yyyy HH:mm:ss'))] $_"
    Add-Content -Path $log -Value $line -Encoding UTF8
    Write-Host $line
  }
  Log "Pipeline done (exit $LASTEXITCODE)."

  Log "---- Cycle $cycle done. Waiting $WaitMinutes minutes ----"
  Log ""
  Start-Sleep -Seconds ($WaitMinutes * 60)
}
