; AutoHotkey v1 script - types "try" and Enter at 01:00 once per day
; Requires AutoHotkey (https://www.autohotkey.com/) - save as .ahk and run or compile.

#NoEnv
SendMode Input
SetBatchLines, -1
#Persistent

; Track last date triggered so it only runs once per day
lastDate := ""

; TestMode: set to 1 for an immediate one-time send when the script starts (useful for quick verification)
; You can also press F9 at any time to manually trigger the send.
TestMode := 0

; Targeting options (optional)
; Set TargetEnabled := 1 to enable targeting. You can choose one of three TargetMode values:
;  - "title"  — match a substring of the window title (recommended for editors like VS Code)
;  - "class"  — match the window class (useful when title changes)
;  - "exe"    — match the executable filename (e.g., Code.exe, powershell.exe)
; Example: TargetMode := "title" and TargetValue := "Visual Studio Code"
TargetEnabled := 0
TargetMode := "title" ; "title" | "class" | "exe"
TargetValue := "" ; set to e.g. "Visual Studio Code" or "Chrome_WidgetWin_1" or "Code.exe"

; Default send text for daily run
DefaultSendText := "try"
; Temporary override text for tests; set when scheduling a one-off test
TestSendOverride := ""

; PreventLock: when enabled, the script will request the system keep display and system awake
; for a short time around the send. Set to 1 to enable.
PreventLock := 1
; How long (ms) to hold the execution state after sending
PreventLockHoldMs := 120000 ; 2 minutes

; Hotkey: schedule a one-shot 60s test that sends "retry" (useful to trigger now)
; Press F10 to schedule the 60-second test. Focus the target window first.
F10::
    TestSendOverride := "retry"
    SetTimer, DoTestSend, -60000
    Tooltip, Scheduled test: will send "retry" in 60s., 10, 10
    Sleep, 1500
    Tooltip
return

DoTestSend:
    ; call DoSend which will use TestSendOverride if set
    Gosub, DoSend
    ; ensure override is cleared after use
    TestSendOverride := ""
return

; Check every 10 seconds
SetTimer, CheckTime, 10000
return

; Manual trigger for testing
F9::
    Gosub, DoSend
return

CheckTime:
FormatTime, nowDate,, yyyy-MM-dd
FormatTime, nowTime,, HH:mm

if (TestMode) {
    ; Clear TestMode so it only triggers once on startup when enabled
    TestMode := 0
    Gosub, DoSend
    return
}

; At 01:00 (1 AM) send the keys once per day
if (nowTime = "01:00" && nowDate != lastDate) {
    Gosub, DoSend
}
return

DoSend:
    FormatTime, nowDate,, yyyy-MM-dd
    lastDate := nowDate
    Sleep, 100

    ; If targeting is enabled, try to activate the target window and wait
    if (TargetEnabled) {
        if (TargetMode = "class") {
            WinActivate, ahk_class %TargetValue%
            WinWaitActive, ahk_class %TargetValue%, , 1000
            if ErrorLevel {
                Tooltip, Target window (class %TargetValue%) not found/active — aborting., 10, 10
                Sleep, 1500
                Tooltip
                return
            }
        } else if (TargetMode = "exe") {
            WinActivate, ahk_exe %TargetValue%
            WinWaitActive, ahk_exe %TargetValue%, , 1000
            if ErrorLevel {
                Tooltip, Target window (exe %TargetValue%) not found/active — aborting., 10, 10
                Sleep, 1500
                Tooltip
                return
            }
        } else {
            ; title match mode: contains
            SetTitleMatchMode, 2
            WinActivate, %TargetValue%
            WinWaitActive, %TargetValue%, , 1000
            if ErrorLevel {
                Tooltip, Target window (title contains "%TargetValue%") not found/active — aborting., 10, 10
                Sleep, 1500
                Tooltip
                return
            }
        }
        ; small delay to ensure window is ready to receive input
        Sleep, 120
    }

    ; Prevent screen lock/sleep if requested: briefly set EXECUTION STATE
    if (PreventLock) {
        ; ES_CONTINUOUS | ES_DISPLAY_REQUIRED | ES_SYSTEM_REQUIRED = 0x80000003
        DllCall("SetThreadExecutionState", "UInt", 0x80000003)
    }

    ; Choose text to send: use TestSendOverride when set (for test), otherwise use DefaultSendText
    SendText := (TestSendOverride != "") ? TestSendOverride : DefaultSendText
    SendInput, %SendText%
    Sleep, 50
    SendInput, {Enter}

    if (PreventLock) {
        ; keep the execution state for a short period so display/sleep don't engage immediately
        Sleep, PreventLockHoldMs
        ; Clear continuous flags: ES_CONTINUOUS = 0x80000000
        DllCall("SetThreadExecutionState", "UInt", 0x80000000)
    }
return
