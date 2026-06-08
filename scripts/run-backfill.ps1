param(
  [int]$TargetCourses  = 1000,   # stop when this many courses exist
  [int]$LimitPerRun    = 50,     # tweets to import & process per pipeline run
  [int]$WaitSeconds    = 20,     # pause between runs
  [int]$MaxZeroRuns    = 3       # stop after N consecutive runs with no new courses
)

$kb  = "c:\My stuff\My Vibe Coding Projects\Knowledge base"
$log = "$kb\logs\backfill.log"

function Count-Courses {
  (Get-ChildItem -Path "$kb\content\courses" -Filter "course-*.md" -Recurse -ErrorAction SilentlyContinue).Count
}

function Log($msg) {
  $line = "[$((Get-Date).ToString('dd-MM-yyyy HH:mm:ss'))] $msg"
  Add-Content -Path $log -Value $line -Encoding UTF8
  Write-Host $line
}

# Ensure logs directory exists
New-Item -ItemType Directory -Path "$kb\logs" -Force | Out-Null

Log "=== Backfill started. Target: $TargetCourses courses. Limit per run: $LimitPerRun ==="
Log "=== Topic filter active: AI, tech, self-help, philosophy, finance only ==="

$zeroProgressRuns = 0

while ($true) {
  $coursesBefore = Count-Courses
  Log "Current courses: $coursesBefore / $TargetCourses"

  if ($coursesBefore -ge $TargetCourses) {
    Log "Target of $TargetCourses courses reached. Backfill complete!"
    break
  }

  Log "--- Running pipeline (limit=$LimitPerRun) ---"

  node "$kb\scripts\run-pipeline.js" --limit $LimitPerRun 2>&1 | ForEach-Object {
    $line = "[$((Get-Date).ToString('dd-MM-yyyy HH:mm:ss'))] $_"
    Add-Content -Path $log -Value $line -Encoding UTF8
    Write-Host $line
  }

  $coursesAfter = Count-Courses
  $newCourses = $coursesAfter - $coursesBefore

  Log "New courses this run: $newCourses (total: $coursesAfter)"

  if ($newCourses -eq 0) {
    $zeroProgressRuns++
    Log "No new courses this run ($zeroProgressRuns / $MaxZeroRuns zero-progress runs)"
    if ($zeroProgressRuns -ge $MaxZeroRuns) {
      Log "No progress for $MaxZeroRuns consecutive runs - no more relevant liked tweets found. Stopping."
      break
    }
  } else {
    $zeroProgressRuns = 0
  }

  Log "Waiting $WaitSeconds seconds before next run..."
  Start-Sleep -Seconds $WaitSeconds
}

# Export to Obsidian vault after backfill completes
Log "Exporting knowledge base to Obsidian vault..."
node "$kb\scripts\export-obsidian.js"
Log "Obsidian vault export complete."

$final = Count-Courses
Log "=== Backfill finished. Final course count: $final ==="
