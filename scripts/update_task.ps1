$scriptPath = "C:\Cloud Project\scripts\auto_type.ahk"
$ahkPath = "C:\Program Files\AutoHotkey\UX\AutoHotkey.exe"
try { Unregister-ScheduledTask -TaskName "CloudProjectAutoType" -Confirm:$false } catch {}

$action = New-ScheduledTaskAction -Execute $ahkPath -Argument "`"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At 1:00AM
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName "CloudProjectAutoType" -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Run auto_type.ahk daily at 01:00 to auto-type 'try'"

Get-ScheduledTask -TaskName "CloudProjectAutoType" | Select-Object TaskName, @{n='Action';e={$_.Actions}}, State | Format-List
