<#
create_task.ps1
Creates a scheduled task to run the AutoHotkey script daily at 01:00 as the current user (interactive logon)
Run this script from an elevated or normal PowerShell prompt. It will register the task to run when the user is logged on
so the AHK script can send keystrokes to the interactive desktop.
#>

$scriptPath = Join-Path $PSScriptRoot "auto_type.ahk"
if (-not (Test-Path $scriptPath)) {
    Write-Error "Could not find $scriptPath. Run this from the scripts folder where auto_type.ahk lives."
    exit 1
}

# Ask for path to AutoHotkey.exe (common install path shown as default)
$defaultAhk = "C:\Program Files\AutoHotkey\AutoHotkey.exe"
$ahkPath = Read-Host "Full path to AutoHotkey.exe (press Enter to accept default: $defaultAhk)"
if ([string]::IsNullOrWhiteSpace($ahkPath)) { $ahkPath = $defaultAhk }
if (-not (Test-Path $ahkPath)) {
    Write-Warning "AutoHotkey executable not found at $ahkPath. The task will still be created but may fail to run until you correct the path."
}

$taskName = "CloudProjectAutoType"
$action = New-ScheduledTaskAction -Execute $ahkPath -Argument "`"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At 1:00AM
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew

try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Run auto_type.ahk daily at 01:00 to auto-type 'try'" -Force
    Write-Host "Scheduled task '$taskName' created to run daily at 01:00. Ensure 'Run only when user is logged on' if you want keystrokes to reach your desktop."
} catch {
    Write-Error "Failed to register scheduled task: $_"
}
