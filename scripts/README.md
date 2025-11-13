Scripts to auto-type `try` at 01:00 (1 AM) and press Enter.

Files added
- `scripts/auto_type.ahk` — Primary AutoHotkey script. Checks the clock every 10s and, when it reads 01:00, sends `try{Enter}` to the active window once per day.
- `scripts/auto_type.ps1` — PowerShell fallback using `System.Windows.Forms.SendKeys` (requires running PowerShell with `-STA`).

Prerequisites
- AutoHotkey (recommended): https://www.autohotkey.com/ (install AutoHotkey v1.x)
  OR
- Windows PowerShell (with .NET Windows Forms support) and run PowerShell in STA mode.

How to run

AutoHotkey (recommended)
1. Install AutoHotkey.
2. Double-click `scripts\\auto_type.ahk` to run it. An AutoHotkey icon will appear in the tray.
3. To stop, right-click the tray icon and Exit.

PowerShell fallback
1. Open an elevated or normal powershell.exe session (the executable must be the Windows PowerShell host that supports Windows.Forms).
2. Run:

```powershell
powershell.exe -STA -File "C:\\Cloud Project\\scripts\\auto_type.ps1"
```

Notes and safety
- These scripts send keystrokes to the active window. Make sure the intended terminal or editor is focused at the trigger time. If the wrong window is focused, keystrokes will go there instead — this can produce unintended input.
- For a safer targeted approach, edit `auto_type.ahk` and use `WinActivate`/`WinWaitActive` with a window title or class (for example a VS Code window) so the script brings the target window to foreground before sending keys.
- To test quickly, you can temporarily change the time check in either script to a near-future time or add a manual trigger line.

Targeting a specific window (new)
--------------------------------
`auto_type.ahk` now supports optional targeting so keystrokes are sent only to a specific window. Configure these variables near the top of `scripts\\auto_type.ahk`:

- `TargetEnabled` — set to `1` to enable targeting (default `0`).
- `TargetMode` — one of: `"title"`, `"class"`, `"exe"`.
- `TargetValue` — the string to match. For `title` this is a substring of the window title; for `class` this is the window class name (e.g. `Chrome_WidgetWin_1`); for `exe` this is the executable filename (e.g. `Code.exe`).

Examples
- Target by title (recommended for VS Code):

  TargetEnabled := 1
  TargetMode := "title"
  TargetValue := "Visual Studio Code"

- Target by window class (useful when title changes):

  TargetEnabled := 1
  TargetMode := "class"
  TargetValue := "Chrome_WidgetWin_1"

- Target by executable name:

  TargetEnabled := 1
  TargetMode := "exe"
  TargetValue := "Code.exe"

Behavior
- When targeting is enabled, the script will call `WinActivate` and `WinWaitActive` (1s timeout). If the target window can't be found/activated the send is aborted and a small tooltip informs you. This prevents accidentally sending keystrokes to the wrong window.

Safety tip: during testing, focus a safe window (Notepad) and use the F9 manual trigger to observe behavior before enabling targeting for production use.

Scheduling at startup (AutoHotkey)
1. Compile the `.ahk` to an `.exe` (optional) or create a shortcut to the `.ahk` file.
2. Place the shortcut in `%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup` to run at user login.

Scheduling with Task Scheduler (PowerShell)
1. Open Task Scheduler and create a new task.
2. Trigger: Daily at 01:00.
3. Action: Start a program
   - Program/script: `powershell.exe`
   - Add arguments: `-STA -WindowStyle Hidden -File "C:\\Cloud Project\\scripts\\auto_type.ps1"`
4. Set "Run only when user is logged on" if the task must send keystrokes to the active desktop. If you set "Run whether user is logged on or not", the script will run in a non-interactive session and SendKeys will not reach your desktop.

Testing
- AutoHotkey quick test
  - Option A (manual): Run the script and press F9 to immediately send `try` + Enter to the active window.
  - Option B (auto on start): Edit `scripts\\auto_type.ahk` and set `TestMode := 1` near the top; on launch the script will perform one immediate send and then revert to normal daily behavior.

- PowerShell quick test
  - Use the `-Test` switch to send immediately and exit:

```powershell
powershell.exe -STA -File "C:\\Cloud Project\\scripts\\auto_type.ps1" -Test
```

Notes: both scripts send keystrokes to whatever window is active. For reliable testing, focus a safe target window (like Notepad or an open terminal) before triggering the test mode. After verifying, undo any TestMode flag changes.

If you want, I can:
- Adjust the AutoHotkey script to target a specific window title/class (e.g., VS Code integrated terminal) so keystrokes always go to the intended target.
- Add a small test harness that triggers immediately for verification and then reverts to daily behavior.
