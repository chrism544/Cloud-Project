# PowerShell fallback to send "try" and Enter at 01:00 once per day
# NOTE: This script requires running PowerShell in STA mode (use powershell.exe -STA -File ...) because SendKeys uses Windows.Forms.
# Run: powershell.exe -STA -File "C:\\Cloud Project\\scripts\\auto_type.ps1"

param(
    [switch]$Test
)

Add-Type -AssemblyName System.Windows.Forms

$lastDate = $null

function Do-Send {
    Start-Sleep -Milliseconds 200
    [System.Windows.Forms.SendKeys]::SendWait('try{ENTER}')
}

if ($Test) {
    Write-Host "Test mode: sending 'try' + Enter once now..."
    Do-Send
    return
}

while ($true) {
    $now = Get-Date
    $timeStr = $now.ToString('HH:mm')
    $dateStr = $now.ToString('yyyy-MM-dd')

    if ($timeStr -eq '01:00' -and $dateStr -ne $lastDate) {
        $lastDate = $dateStr
        Do-Send
    }

    Start-Sleep -Seconds 10
}
