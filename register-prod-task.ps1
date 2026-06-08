# register-prod-task.ps1
# Registers "KnowledgeBase Prod Deploy" in Windows Task Scheduler.
# Runs start-prod.bat daily at 1:00 PM IST.
#
# Run this ONCE as Administrator:
#   powershell -ExecutionPolicy Bypass -File "register-prod-task.ps1"

$TaskName   = "KnowledgeBase Prod Deploy"
$BatFile    = "C:\My stuff\My Vibe Coding Projects\Knowledge base\start-prod.bat"
$WorkingDir = "C:\My stuff\My Vibe Coding Projects\Knowledge base"

# Remove existing task if it already exists
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Write-Host "Removing existing task '$TaskName'..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Action: run the bat file via cmd
$Action = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$BatFile`"" `
    -WorkingDirectory $WorkingDir

# Trigger: daily at 1:00 PM
$Trigger = New-ScheduledTaskTrigger -Daily -At "1:00PM"

# Settings: run only when logged in, allow it to run on demand too
$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable

# Register (no RunLevel Highest — avoids needing elevation for current-user tasks)
Register-ScheduledTask `
    -TaskName   $TaskName `
    -Action     $Action `
    -Trigger    $Trigger `
    -Settings   $Settings `
    -Description "Builds and restarts the KnowledgeBase production server (port 3006) daily at 1 PM, after the 12 PM data pipeline completes."

Write-Host ""
Write-Host "Task '$TaskName' registered successfully."
Write-Host "It will run daily at 1:00 PM -> build + restart :3006"
Write-Host ""
Write-Host "To run it manually right now:"
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
