<#
.SYNOPSIS
    Portal Management System - Project Manager GUI (V3 - Modern Card Layout).
    Refactored Windows Forms application to match a modern, grouped, dark-theme layout.
.DESCRIPTION
    This script initializes a graphical interface for managing local containers,
    building front-end/back-end, handling Git, and deploying to configured VPS targets,
    using a clean, card-based UI.
#>

# Add the necessary .NET assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ==============================================================================
# 1. CONFIGURATION, STYLES & STATE
# ==============================================================================
$CONFIG_FILE = ".project_manager.conf"

# --- Default Values ---
$script:DOCKER_HUB_USERNAME = "chrism544"
$script:DOCKER_HUB_REPO_BACKEND = "cloud_project_backend"
$script:DOCKER_HUB_REPO_FRONTEND = "cloud_project_frontend"
$script:VPS_CONFIGS = @{
    "development" = "ubuntu@37.59.115.194"
    "staging" = "ubuntu@37.59.115.194"
    "production" = "ubuntu@37.59.115.194"
}

# --- GUI Components and State ---
$script:mainForm = $null
$script:logBox = $null
$script:statusLabel = $null
$script:configLabels = @{} # Dictionary to hold configuration labels
$script:vpsDropdown = $null
$script:isTaskRunning = $false

# --- Color Palette (Matching the new dark theme image) ---
$Color_Background = [System.Drawing.ColorTranslator]::FromHtml("#111827") # Very Dark Blue-Gray (Main Background)
$Color_Panel = [System.Drawing.ColorTranslator]::FromHtml("#1f2937")      # Dark Blue-Gray (Card/Panel Background)
$Color_LogBackground = [System.Drawing.ColorTranslator]::FromHtml("#111827") # Log Background (Same as Main BG for seamless look)
$Color_TextPrimary = [System.Drawing.Color]::White
$Color_TextSecondary = [System.Drawing.ColorTranslator]::FromHtml("#9ca3af") # Gray text

# Accents
$Color_PrimaryHeader = [System.Drawing.ColorTranslator]::FromHtml("#60a5fa") # Light Blue (Header/Title)
$Color_SectionHeader = [System.Drawing.ColorTranslator]::FromHtml("#9ca3af") # Gray (Section Titles)
$Color_Success = [System.Drawing.ColorTranslator]::FromHtml("#14b8a6")       # Soft Teal (Primary / Success)
$Color_Danger = [System.Drawing.ColorTranslator]::FromHtml("#f97316")        # Soft Orange/Red (Danger/Warning)
$Color_Warn = [System.Drawing.ColorTranslator]::FromHtml("#f59e0b")          # Amber (Restart)
$Color_AccentPurple = [System.Drawing.ColorTranslator]::FromHtml("#7c3aed")  # Purple (Builds/Push)
$Color_Secondary = [System.Drawing.ColorTranslator]::FromHtml("#60a5fa")     # Soft Blue (Info/Secondary)

# ==============================================================================
# 2. LOGGING AND STATUS HANDLING
# ==============================================================================

function Update-StatusBar {
    param(
        [string]$Message,
        [System.Drawing.Color]$Color = $Color_TextSecondary
    )
    if ($script:statusLabel -is [System.Windows.Forms.Label]) {
        $script:statusLabel.Text = "STATUS: $Message"
    }
    # Also update bottom READY bar if present
    if ($script:readyBar -ne $null -and $script:readyLabel -ne $null) {
        if ($Message -match '^READY') {
            $script:readyBar.BackColor = $Color_Success
            $script:readyLabel.ForeColor = [System.Drawing.Color]::White
            $script:readyLabel.Text = $Message
        } elseif ($Message -match '^ERROR') {
            $script:readyBar.BackColor = $Color_Danger
            $script:readyLabel.ForeColor = [System.Drawing.Color]::White
            $script:readyLabel.Text = $Message
        } else {
            # neutral
            $script:readyBar.BackColor = $Color_Panel
            $script:readyLabel.ForeColor = $Color_TextSecondary
            $script:readyLabel.Text = $Message
        }
    }
}

function Write-OutputLog {
    param(
        [string]$Message,
        [System.Drawing.Color]$Color = $Color_TextPrimary,
        [string]$Tag = "[INFO]"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    $formattedMessage = "$timestamp $Tag $Message`r`n"

    if ($script:logBox -is [System.Windows.Forms.RichTextBox]) {
        # Append timestamp in muted gray, tag in subtle color, message in main color
        $start = $script:logBox.TextLength
        $script:logBox.SelectionStart = $start

        # timestamp
        $script:logBox.SelectionColor = $Color_TextSecondary
        $script:logBox.AppendText("$timestamp ")

        # tag
        switch ($Tag) {
            "[ERROR]" { $tagColor = $Color_Danger }
            "[WARN]"  { $tagColor = $Color_Warn }
            "[OK]"    { $tagColor = $Color_Success }
            default    { $tagColor = $Color_Secondary }
        }
        $script:logBox.SelectionColor = $tagColor
        $script:logBox.AppendText("$Tag ")

        # main message
        $script:logBox.SelectionColor = $Color_TextPrimary
        $script:logBox.AppendText("$Message`r`n")

        $script:logBox.SelectionStart = $script:logBox.TextLength
        $script:logBox.ScrollToCaret()
    } else {
        Write-Host "$Tag $Message"
    }
}

function Write-InfoMsg { param([string]$Message) Write-OutputLog $Message -Tag "[INFO]" -Color $Color_TextPrimary }
function Write-SuccessMsg { param([string]$Message) Write-OutputLog $Message -Tag "[OK]" -Color $Color_Success }
function Write-ErrorMsg { param([string]$Message) Write-OutputLog $Message -Tag "[ERROR]" -Color $Color_Danger }
function Write-WarningMsg { param([string]$Message) Write-OutputLog $Message -Tag "[WARN]" -Color $Color_Warn }


# --- Configuration Functions ---

function Update-ConfigDisplay {
    if ($script:configLabels.ContainsKey("DockerHubUser")) {
        $script:configLabels["DockerHubUser"].Text = $script:DOCKER_HUB_USERNAME
        $script:configLabels["BackendRepo"].Text = $script:DOCKER_HUB_REPO_BACKEND
        $script:configLabels["FrontendRepo"].Text = $script:DOCKER_HUB_REPO_FRONTEND
    }
    
    if ($script:vpsDropdown -is [System.Windows.Forms.ComboBox]) {
        $script:vpsDropdown.Items.Clear()
        $script:vpsDropdown.Items.AddRange(@($script:VPS_CONFIGS.Keys))
        if ($script:vpsDropdown.Items.Count -gt 0) {
            $script:vpsDropdown.SelectedIndex = 0
        }
    }
}

function Load-Config {
    if (Test-Path $CONFIG_FILE) {
        Get-Content $CONFIG_FILE | ForEach-Object {
            if ($_ -match '^([^=]+)=(.+)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim('"')
                Set-Variable -Name $name -Value $value -Scope Script
            }
        }
        Write-SuccessMsg "Configuration loaded."
    } else {
        Write-WarningMsg "Configuration file not found. Using defaults."
    }
    Update-ConfigDisplay
}

function Save-Config {
    @"
# Project Manager Configuration
DOCKER_HUB_USERNAME="$script:DOCKER_HUB_USERNAME"
DOCKER_HUB_REPO_BACKEND="$script:DOCKER_HUB_REPO_BACKEND"
DOCKER_HUB_REPO_FRONTEND="$script:DOCKER_HUB_REPO_FRONTEND"
"@ | Out-File -FilePath $CONFIG_FILE -Encoding UTF8
    Write-SuccessMsg "Configuration saved."
    Update-ConfigDisplay
}

function Set-DockerHubConfig {
    [void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic")
    $newUsername = [Microsoft.VisualBasic.Interaction]::InputBox("Enter Docker Hub username:", "Docker Hub Configuration", $script:DOCKER_HUB_USERNAME)
    if (-not [string]::IsNullOrEmpty($newUsername)) { $script:DOCKER_HUB_USERNAME = $newUsername }
    
    $newBackend = [Microsoft.VisualBasic.Interaction]::InputBox("Enter backend repository name:", "Backend Repo", $script:DOCKER_HUB_REPO_BACKEND)
    if (-not [string]::IsNullOrEmpty($newBackend)) { $script:DOCKER_HUB_REPO_BACKEND = $newBackend }
    
    $newFrontend = [Microsoft.VisualBasic.Interaction]::InputBox("Enter frontend repository name:", "Frontend Repo", $script:DOCKER_HUB_REPO_FRONTEND)
    if (-not [string]::IsNullOrEmpty($newFrontend)) { $script:DOCKER_HUB_REPO_FRONTEND = $newFrontend }

    Save-Config
    Write-SuccessMsg "Docker Hub configured."
}

function Set-VPSConfig {
    [void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.VisualBasic")
    $vpsName = [Microsoft.VisualBasic.Interaction]::InputBox("Enter new or existing VPS name (e.g., 'staging'):", "VPS Name")
    
    if ([string]::IsNullOrEmpty($vpsName)) {
        Write-WarningMsg "VPS configuration cancelled."
        return
    }

    $currentSSH = if ($script:VPS_CONFIGS.ContainsKey($vpsName)) { $script:VPS_CONFIGS[$vpsName] } else { "user@host" }
    $sshString = [Microsoft.VisualBasic.Interaction]::InputBox("Enter SSH connection string (user@host):", "SSH Connection", $currentSSH)
    
    if (-not [string]::IsNullOrEmpty($sshString)) { 
        $script:VPS_CONFIGS[$vpsName] = $sshString
        Write-SuccessMsg "VPS '$vpsName' configured."
    } else {
        Write-WarningMsg "VPS configuration cancelled."
    }
    Update-ConfigDisplay
}


# ==============================================================================
# 3. TASK WRAPPER AND CORE LOGIC (With Status Updates)
# ==============================================================================

function Task-Wrapper {
    param([scriptblock]$Action, [string]$TaskName)
    
    if ($script:isTaskRunning) {
        Write-WarningMsg "Another task is already running. Please wait."
        Update-StatusBar "BUSY - Waiting for $TaskName" 
        return
    }
    
    $script:isTaskRunning = $true
    Update-StatusBar "RUNNING: $TaskName..." 
    Write-InfoMsg ">>> STARTING TASK: $TaskName <<<"

    try {
        & $Action 2>&1 | ForEach-Object { Write-OutputLog $_ -Tag "[CMD]" }
        Write-SuccessMsg ">>> TASK COMPLETED: $TaskName <<<"
        Update-StatusBar "READY: Last task ($TaskName) succeeded." 
    } catch {
        Write-ErrorMsg ">>> TASK FAILED: $TaskName <<<"
        Write-ErrorMsg "Error: $($_.Exception.Message)"
        Update-StatusBar "ERROR: Last task ($TaskName) failed." 
    } finally {
        $script:isTaskRunning = $false
    }
}

function Start-Containers { Write-InfoMsg "Starting Docker Containers..."; & docker-compose up -d; & docker-compose ps }
function Stop-Containers { Write-InfoMsg "Stopping Docker Containers..."; & docker-compose down }
function Restart-Containers { Write-InfoMsg "Restarting Docker Containers..."; & docker-compose restart; & docker-compose ps }
function Show-ContainerStatus { Write-InfoMsg "Checking Container Status..."; & docker-compose ps; & docker stats --no-stream }
function Build-Backend { Write-InfoMsg "Building Backend..."; & npm run build }
function Build-Frontend { Write-InfoMsg "Building Frontend..."; Push-Location frontend; & npm run build; Pop-Location }
function Build-DockerImages { 
    Write-InfoMsg "Building Docker Images..."
    & docker build -t "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):latest" .
    & docker build --build-arg NEXT_PUBLIC_API_URL=https://api.home-networks.org -t "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):latest" ./frontend
}
function Push-Images { 
    Write-InfoMsg "Pushing Docker Images..."
    & docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):latest"
    & docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):latest"
}

# Git Push helper: prompts for commit message and pushes current repo to remote
function Git-PushAction {
    try {
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing

        # repo info
        $currentBranch = (& git rev-parse --abbrev-ref HEAD 2>$null).Trim()
        if (-not $currentBranch) { $currentBranch = "main" }
        $remotes = (& git remote 2>$null) -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
        if (-not $remotes) { $remotes = @('origin') }

        # check working tree
        $status = (& git status --porcelain 2>$null) -join "`n"
        $hasChanges = -not [string]::IsNullOrWhiteSpace($status)

        # build diff preview
        $stagedDiff = (& git diff --staged 2>$null) -join "`n"
        $unstagedDiff = (& git diff 2>$null) -join "`n"
        $combinedDiff = "";
        if (-not [string]::IsNullOrWhiteSpace($stagedDiff)) { $combinedDiff += "--- Staged Changes ---`n$stagedDiff`n`n" }
        if (-not [string]::IsNullOrWhiteSpace($unstagedDiff)) { $combinedDiff += "--- Unstaged Changes ---`n$unstagedDiff`n`n" }
        if ([string]::IsNullOrWhiteSpace($combinedDiff)) { $combinedDiff = "(No differences to show)" }

        # Create preview dialog
        $form = New-Object System.Windows.Forms.Form
        $form.Text = "Git Commit & Push"
        $form.Size = New-Object System.Drawing.Size(900,700)
        $form.StartPosition = 'CenterParent'

        $lblBranch = New-Object System.Windows.Forms.Label
        $lblBranch.Text = "Current Branch:"
        $lblBranch.Location = New-Object System.Drawing.Point(10,10)
        $lblBranch.AutoSize = $true
        $form.Controls.Add($lblBranch)

        $txtBranch = New-Object System.Windows.Forms.TextBox
        $txtBranch.Location = New-Object System.Drawing.Point(120,8)
        $txtBranch.Size = New-Object System.Drawing.Size(200,22)
        $txtBranch.Text = $currentBranch
        $form.Controls.Add($txtBranch)

        $lblRemote = New-Object System.Windows.Forms.Label
        $lblRemote.Text = "Remote:"
        $lblRemote.Location = New-Object System.Drawing.Point(340,10)
        $lblRemote.AutoSize = $true
        $form.Controls.Add($lblRemote)

        $cmbRemote = New-Object System.Windows.Forms.ComboBox
        $cmbRemote.Location = New-Object System.Drawing.Point(390,6)
        $cmbRemote.Size = New-Object System.Drawing.Size(150,22)
        $cmbRemote.DropDownStyle = 'DropDownList'
        $cmbRemote.Items.AddRange($remotes)
        $cmbRemote.SelectedIndex = 0
        $form.Controls.Add($cmbRemote)

        $lblMsg = New-Object System.Windows.Forms.Label
        $lblMsg.Text = "Commit message:"
        $lblMsg.Location = New-Object System.Drawing.Point(10,40)
        $lblMsg.AutoSize = $true
        $form.Controls.Add($lblMsg)

        $txtMsg = New-Object System.Windows.Forms.TextBox
        $txtMsg.Location = New-Object System.Drawing.Point(10,60)
        $txtMsg.Size = New-Object System.Drawing.Size(860,24)
        $txtMsg.Text = "Update from PMS GUI"
        $form.Controls.Add($txtMsg)

        $chkForce = New-Object System.Windows.Forms.CheckBox
        $chkForce.Location = New-Object System.Drawing.Point(560,8)
        $chkForce.Size = New-Object System.Drawing.Size(200,22)
        $chkForce.Text = "Force push if needed"
        $form.Controls.Add($chkForce)

        $lblDiff = New-Object System.Windows.Forms.Label
        $lblDiff.Text = "Changes Preview"
        $lblDiff.Location = New-Object System.Drawing.Point(10,95)
        $lblDiff.AutoSize = $true
        $form.Controls.Add($lblDiff)

        $diffBox = New-Object System.Windows.Forms.RichTextBox
        $diffBox.Location = New-Object System.Drawing.Point(10,120)
        $diffBox.Size = New-Object System.Drawing.Size(860,480)
        $diffBox.Font = New-Object System.Drawing.Font("Consolas", 9)
        $diffBox.ReadOnly = $true
        $diffBox.WordWrap = $false
        $diffBox.Text = $combinedDiff
        $form.Controls.Add($diffBox)

        # Buttons
        $btnCancel = New-Object System.Windows.Forms.Button
        $btnCancel.Text = "Cancel"
        $btnCancel.Location = New-Object System.Drawing.Point(760,610)
        $btnCancel.Size = New-Object System.Drawing.Size(100,30)
        $btnCancel.Add_Click({ $form.Tag = 'cancel'; $form.Close() })
        $form.Controls.Add($btnCancel)

        $btnConfirm = New-Object System.Windows.Forms.Button
        $btnConfirm.Text = "Commit & Push"
        $btnConfirm.Location = New-Object System.Drawing.Point(640,610)
        $btnConfirm.Size = New-Object System.Drawing.Size(100,30)
        $btnConfirm.Add_Click({ $form.Tag = 'ok'; $form.Close() })
        $form.Controls.Add($btnConfirm)

        # If working tree is clean, warn and require confirmation
        if (-not $hasChanges) {
            $form.Text = "Git Push - No Local Changes"
            $diffBox.Text = "Working tree is clean. No staged or unstaged changes detected.`n`nYou can still push the current branch to the remote. If you want to force-update the remote branch, enable 'Force push if needed'.`n`nCurrent branch: $currentBranch`nRemotes: $($remotes -join ', ')"
        }

        $null = $form.ShowDialog()

        if ($form.Tag -ne 'ok') {
            Write-WarningMsg "Git push cancelled by user."
            return
        }

        $targetBranch = $txtBranch.Text.Trim()
        $targetRemote = $cmbRemote.SelectedItem
        $commitMsg = $txtMsg.Text.Trim()
        $forcePush = $chkForce.Checked

        if (-not $commitMsg -and $hasChanges) {
            Write-WarningMsg "Commit message required for new changes. Push cancelled."
            return
        }

        # Stage changes
        if ($hasChanges) {
            Write-InfoMsg "Staging changes..."
            & git add -A 2>&1 | ForEach-Object { Write-OutputLog $_ -Tag "[GIT]" }
        }

        # Commit (if there are changes)
        if ($hasChanges) {
            Write-InfoMsg "Committing..."
            $commitOutput = & git commit -m "$commitMsg" 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-InfoMsg $commitOutput | ForEach-Object { Write-OutputLog $_ -Tag "[GIT]" }
            } else {
                $commitOutput | ForEach-Object { Write-OutputLog $_ -Tag "[GIT]" }
            }
        }

        # Push
        Write-InfoMsg "Pushing to $targetRemote/$targetBranch..."
        $pushArgs = "$targetRemote $targetBranch"
        if ($forcePush) { $pushArgs = "--force $pushArgs" }
        $pushOutput = & git push $pushArgs 2>&1
        $pushOutput | ForEach-Object { Write-OutputLog $_ -Tag "[GIT]" }
        if ($LASTEXITCODE -eq 0) {
            Write-SuccessMsg "Code pushed to $targetRemote/$targetBranch."
        } else {
            Write-ErrorMsg "Git push failed. See log for details."
        }

    } catch {
        Write-ErrorMsg "Git push failed: $($_.Exception.Message)"
    }
}

function Rebuild-All {
    Write-InfoMsg "Starting FULL REBUILD SEQUENCE..."
    
    Task-Wrapper { Build-Backend } "Build Backend"
    Task-Wrapper { Build-Frontend } "Build Frontend"
    Task-Wrapper { Build-DockerImages } "Build Docker Images"
    Task-Wrapper { Push-Images } "Push Images"

    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Preparing deployment to $vpsTarget..."
    Task-Wrapper { Deploy-ToVPS $vpsTarget } "Deploy to VPS ($vpsTarget)"
    
    Write-SuccessMsg "FULL REBUILD SEQUENCE COMPLETED."
}

function Deploy-ToVPS {
    param([string]$vpsName)
    Write-InfoMsg "Deploying to $vpsName..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsName)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsName]
        & ssh $sshTarget 'mkdir -p /home/ubuntu/app && sudo usermod -aG docker ubuntu && rm -f /home/ubuntu/app/Caddyfile'
        & scp docker-compose.yml "$sshTarget`:/home/ubuntu/app/"
        & scp Caddyfile "$sshTarget`:/home/ubuntu/app/"
        & scp .env "$sshTarget`:/home/ubuntu/app/"
        & ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker compose down && docker compose pull && docker image prune -f && docker compose up -d && sleep 15 && docker exec portal-backend npx prisma db seed && docker compose ps'"
        Write-SuccessMsg "Deployment completed for $vpsName ($sshTarget)."
    } else {
        Write-ErrorMsg "VPS target $vpsName not found."
    }
}

function Deploy-LatestToVPS {
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Deploying latest images to $vpsTarget..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        Write-InfoMsg "Stopping containers and cleaning up..."
        & ssh $sshTarget "cd /home/ubuntu/app 2>/dev/null && sg docker -c 'docker compose down' 2>/dev/null; mkdir -p /home/ubuntu/app && sudo usermod -aG docker ubuntu && rm -rf /home/ubuntu/app/Caddyfile"
        Write-InfoMsg "Copying configuration files..."
        & scp docker-compose.yml "$sshTarget`:/home/ubuntu/app/"
        & scp Caddyfile "$sshTarget`:/home/ubuntu/app/"
        & scp .env "$sshTarget`:/home/ubuntu/app/"
        Write-InfoMsg "Pulling latest images and starting services..."
        & ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker image prune -af && docker compose pull && docker compose up -d && sleep 15 && docker exec portal-backend npx prisma db seed && docker compose ps'"
        Write-SuccessMsg "Latest images deployed to $vpsTarget."
    } else {
        Write-ErrorMsg "VPS target $vpsTarget not found."
    }
}

function Show-VPSStatus {
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Checking VPS status for $vpsTarget..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        & ssh $sshTarget "cd /home/ubuntu/app && docker compose ps && docker stats --no-stream && echo '=== Frontend Env Check ===' && docker exec portal-frontend printenv | grep API"
    } else {
        Write-ErrorMsg "VPS target $vpsTarget not found."
    }
}

function Restart-VPSServices {
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Restarting VPS services for $vpsTarget..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        & ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker compose restart && docker compose ps'"
        Write-SuccessMsg "VPS services restarted for $vpsTarget."
    } else {
        Write-ErrorMsg "VPS target $vpsTarget not found."
    }
}

function Stop-VPSContainers {
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Stopping VPS containers for $vpsTarget..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        & ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker compose down && docker compose ps'"
        Write-SuccessMsg "VPS containers stopped for $vpsTarget."
    } else {
        Write-ErrorMsg "VPS target $vpsTarget not found."
    }
}

function Start-VPSContainers {
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Starting VPS containers for $vpsTarget..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        & ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker compose up -d && docker compose ps'"
        Write-SuccessMsg "VPS containers started for $vpsTarget."
    } else {
        Write-ErrorMsg "VPS target $vpsTarget not found."
    }
}

# Get VPS container status via SSH for the selected VPS target
function Get-VPSContainerStatus {
    try {
        $vpsTarget = $script:vpsDropdown.SelectedItem
        if (-not $vpsTarget -or -not $script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
            return $null
        }
        $sshTarget = $script:VPS_CONFIGS[$vpsTarget]
        # Get running container names from VPS
        $output = & ssh $sshTarget "docker ps --format '{{.Names}}'" 2>$null
        return $output
    } catch {
        return $null
    }
}

function Show-Logs { Write-InfoMsg "Showing Local Logs (Last 50 lines)..."; & docker-compose logs --tail=50 }
function Connect-VPS { 
    $vpsTarget = $script:vpsDropdown.SelectedItem
    Write-InfoMsg "Connecting to VPS ($vpsTarget)..."
    if ($script:VPS_CONFIGS.ContainsKey($vpsTarget)) {
        Start-Process -FilePath "ssh" -ArgumentList $script:VPS_CONFIGS[$vpsTarget]
    }
}

function Show-Help {
    $helpText = @"
PORTAL MANAGEMENT SYSTEM - QUICK HELP

=== QUICK START ===
1. START Containers - Start all services locally
2. Make code changes in your editor
3. Build Docker Images - Bake changes into images
4. Push Images - Upload to Docker Hub
5. Deploy to VPS - Pull and run on server

=== CONTAINER LIFECYCLE ===
• START - Starts all containers (postgres, redis, backend, frontend)
• STOP - Stops and removes all containers
• RESTART - Restarts containers without rebuilding
• Status - Shows running containers and resource usage

=== BUILD & DEPLOYMENT ===
• Build BACKEND - Compiles TypeScript backend code
• Build FRONTEND - Builds Next.js frontend
• Build Docker Images - Creates Docker images with latest code
• Push Images - Uploads images to Docker Hub (chrism544/*)
• Deploy to VPS - Full deployment with file copy

=== VPS OPERATIONS ===
• Deploy to VPS - Pulls latest images and restarts on VPS
• Show VPS Status - Displays container status on VPS
• Restart VPS Services - Restarts containers on VPS

=== CONFIGURATION ===
• Config Docker Hub - Set username and repository names
• Config VPS - Add/edit VPS SSH connection strings
• Logs (Local) - View last 50 lines of container logs
• Connect to VPS - Opens SSH terminal to VPS

=== WORKFLOW ===
Local Development:
  Edit Code → Build Images → START Containers → Test

VPS Deployment:
  Build Images → Push Images → Deploy to VPS

=== TIPS ===
• Use STOP then START (not RESTART) after code changes
• Build Docker Images after any code changes
• Check logs if containers fail to start
• VPS dropdown selects target environment

=== TROUBLESHOOTING ===
Containers won't start:
  → Check logs with 'Logs (Local)'
  → Ensure ports 3000, 3001, 5432 are free
  → Try STOP then START

Changes not appearing:
  → Rebuild Docker Images
  → STOP and START containers
  → Clear browser cache

VPS deployment fails:
  → Check SSH connection
  → Verify Docker Hub credentials
  → Check VPS has Docker installed

=== DOCUMENTATION ===
See project README.md for detailed information
"@
    
    [System.Windows.Forms.MessageBox]::Show($helpText, "PMS Help", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
}

# ==============================================================================
# 4. GUI WINDOW CREATION
# ==============================================================================

function Show-ProjectManagerGUI {
    $script:mainForm = New-Object System.Windows.Forms.Form
    $script:mainForm.Text = "Portal Management System - Project Manager"
    $script:mainForm.Size = New-Object System.Drawing.Size(1200, 850)
    $script:mainForm.StartPosition = "CenterScreen"
    $script:mainForm.BackColor = $Color_Background
    $script:mainForm.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedSingle
    $script:mainForm.MaximizeBox = $false

    $titleLabel = New-Object System.Windows.Forms.Label
    $titleLabel.Text = "PMS Project Manager"
    $titleLabel.Location = New-Object System.Drawing.Point(20, 20)
    $titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
    $titleLabel.ForeColor = $Color_TextPrimary
    $titleLabel.AutoSize = $true
    $script:mainForm.Controls.Add($titleLabel)

    $subtitleLabel = New-Object System.Windows.Forms.Label
    $subtitleLabel.Text = "Unified Control for Development & Deployment Pipeline"
    $subtitleLabel.Location = New-Object System.Drawing.Point(20, 55)
    $subtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $subtitleLabel.ForeColor = $Color_TextSecondary
    $subtitleLabel.AutoSize = $true
    $script:mainForm.Controls.Add($subtitleLabel)

    $contentPanel = New-Object System.Windows.Forms.Panel
    $contentPanel.Location = New-Object System.Drawing.Point(0, 80)
    $contentPanel.Size = New-Object System.Drawing.Size(1180, 700)
    $contentPanel.BackColor = $Color_Background
    $script:mainForm.Controls.Add($contentPanel)

    # Configuration Card
    $configCard = New-Object System.Windows.Forms.Panel
    $configCard.Location = New-Object System.Drawing.Point(640, 20)
    $configCard.Size = New-Object System.Drawing.Size(520, 200)
    $configCard.BackColor = $Color_Panel
    $contentPanel.Controls.Add($configCard)
    
    $configTitle = New-Object System.Windows.Forms.Label
    $configTitle.Text = "Current Configuration"
    $configTitle.Location = New-Object System.Drawing.Point(15, 15)
    $configTitle.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $configTitle.ForeColor = $Color_TextPrimary
    $configTitle.AutoSize = $true
    $configCard.Controls.Add($configTitle)
    
    function Add-ConfigLine {
        param([string]$Key, [string]$Id, [int]$YPos)
        $labelKey = New-Object System.Windows.Forms.Label
        $labelKey.Text = "$Key"
        $labelKey.Location = New-Object System.Drawing.Point(280, $YPos)
        $labelKey.Font = New-Object System.Drawing.Font("Segoe UI", 9)
        $labelKey.ForeColor = $Color_TextSecondary
        $labelKey.AutoSize = $false
        $labelKey.Size = New-Object System.Drawing.Size(110, 20)
        $labelKey.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
        $configCard.Controls.Add($labelKey)

        $valueYPos = $YPos + 18
        $labelValue = New-Object System.Windows.Forms.Label
        $labelValue.Text = ""
        $labelValue.Location = New-Object System.Drawing.Point(280, $valueYPos)
        $labelValue.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
        $labelValue.ForeColor = $Color_Success
        $labelValue.AutoSize = $false
        $labelValue.Size = New-Object System.Drawing.Size(220, 16)
        $labelValue.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
        $script:configLabels[$Id] = $labelValue
        $configCard.Controls.Add($labelValue)
    }

    Add-ConfigLine "Docker Hub User:" "DockerHubUser" 50
    Add-ConfigLine "Backend Repo:" "BackendRepo" 88
    Add-ConfigLine "Frontend Repo:" "FrontendRepo" 126

    $labelVpsTargets = New-Object System.Windows.Forms.Label
    $labelVpsTargets.Text = "VPS Targets:"
    $labelVpsTargets.Location = New-Object System.Drawing.Point(280, 164)
    $labelVpsTargets.Font = New-Object System.Drawing.Font("Segoe UI", 9)
    $labelVpsTargets.ForeColor = $Color_TextSecondary
    $labelVpsTargets.AutoSize = $true
    $configCard.Controls.Add($labelVpsTargets)

    $script:vpsDropdown = New-Object System.Windows.Forms.ComboBox
    $script:vpsDropdown.Location = New-Object System.Drawing.Point(360, 162)
    $script:vpsDropdown.Size = New-Object System.Drawing.Size(140, 25)
    $script:vpsDropdown.DropDownStyle = [System.Windows.Forms.ComboBoxStyle]::DropDownList
    $configCard.Controls.Add($script:vpsDropdown)

    # Container Status Panel
    $statusPanel = New-Object System.Windows.Forms.Panel
    $statusPanel.Location = New-Object System.Drawing.Point(15, 50)
    $statusPanel.Size = New-Object System.Drawing.Size(120, 140)
    $statusPanel.BackColor = $Color_Panel
    $configCard.Controls.Add($statusPanel)

    $statusTitle = New-Object System.Windows.Forms.Label
    $statusTitle.Text = "Local Status"
    $statusTitle.Location = New-Object System.Drawing.Point(5, 0)
    $statusTitle.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $statusTitle.ForeColor = $Color_TextSecondary
    $statusTitle.AutoSize = $true
    $statusPanel.Controls.Add($statusTitle)

    $script:containerStatus = @{}
    $containers = @("Backend", "Frontend", "Postgres", "Redis", "MinIO", "Caddy")
    $yPos = 18
    foreach ($container in $containers) {
        # small pill indicator
        $pill = New-Object System.Windows.Forms.Panel
        $pill.Size = New-Object System.Drawing.Size(10, 10)
        $pill.Location = New-Object System.Drawing.Point(5, $yPos)
        $pill.BackColor = $Color_Danger
        $statusPanel.Controls.Add($pill)
        try { Set-RoundedControl $pill 8 } catch {}

    $name = New-Object System.Windows.Forms.Label
    $name.Text = $container
    # ensure $yPos is numeric (defensive for unexpected array values)
    $curY = if ($yPos -is [System.Array]) { $yPos[0] } else { $yPos }
    $labelY = [int]($curY - 2)
    $name.Location = New-Object System.Drawing.Point(20, $labelY)
    $name.Font = New-Object System.Drawing.Font("Segoe UI", 8)
    $name.ForeColor = $Color_TextSecondary
    $name.AutoSize = $true
    $statusPanel.Controls.Add($name)

        $script:containerStatus[$container] = $pill
        $yPos += 20
    }

    # VPS Status Panel (right side of Local Status)
    $vpsStatusPanel = New-Object System.Windows.Forms.Panel
    $vpsStatusPanel.Location = New-Object System.Drawing.Point(145, 50)
    $vpsStatusPanel.Size = New-Object System.Drawing.Size(120, 140)
    $vpsStatusPanel.BackColor = $Color_Panel
    $configCard.Controls.Add($vpsStatusPanel)

    $vpsStatusTitle = New-Object System.Windows.Forms.Label
    $vpsStatusTitle.Text = "VPS Status"
    $vpsStatusTitle.Location = New-Object System.Drawing.Point(5, 0)
    $vpsStatusTitle.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $vpsStatusTitle.ForeColor = $Color_TextSecondary
    $vpsStatusTitle.AutoSize = $true
    $vpsStatusPanel.Controls.Add($vpsStatusTitle)

    $script:vpsContainerStatus = @{}
    $vpsContainers = @("Backend", "Frontend", "Postgres", "Redis", "MinIO", "Caddy")
    $yPosVps = 18
    foreach ($container in $vpsContainers) {
        # small pill indicator
        $pill = New-Object System.Windows.Forms.Panel
        $pill.Size = New-Object System.Drawing.Size(10, 10)
        $pill.Location = New-Object System.Drawing.Point(5, $yPosVps)
        $pill.BackColor = $Color_Danger
        $vpsStatusPanel.Controls.Add($pill)
        try { Set-RoundedControl $pill 8 } catch {}

        $name = New-Object System.Windows.Forms.Label
        $name.Text = $container
        $curY = if ($yPosVps -is [System.Array]) { $yPosVps[0] } else { $yPosVps }
        $labelY = [int]($curY - 2)
        $name.Location = New-Object System.Drawing.Point(20, $labelY)
        $name.Font = New-Object System.Drawing.Font("Segoe UI", 8)
        $name.ForeColor = $Color_TextSecondary
        $name.AutoSize = $true
        $vpsStatusPanel.Controls.Add($name)

        $script:vpsContainerStatus[$container] = $pill
        $yPosVps += 20
    }

    $logCard = New-Object System.Windows.Forms.Panel
    $logCard.Location = New-Object System.Drawing.Point(640, 230)
    $logCard.Size = New-Object System.Drawing.Size(520, 450)
    $logCard.BackColor = $Color_Panel
    $contentPanel.Controls.Add($logCard)

    $logTitle = New-Object System.Windows.Forms.Label
    $logTitle.Text = "Activity Log"
    $logTitle.Location = New-Object System.Drawing.Point(15, 15)
    $logTitle.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $logTitle.ForeColor = $Color_TextPrimary
    $logTitle.AutoSize = $true
    $logCard.Controls.Add($logTitle)

    # Clear Log Button
    $clearLogBtn = New-Object System.Windows.Forms.Button
    $clearLogBtn.Text = "Clear"
    $clearLogBtn.Location = New-Object System.Drawing.Point(250, 15)
    $clearLogBtn.Size = New-Object System.Drawing.Size(55, 25)
    $clearLogBtn.BackColor = $Color_Danger
    $clearLogBtn.ForeColor = [System.Drawing.Color]::White
    $clearLogBtn.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
    $clearLogBtn.FlatAppearance.BorderSize = 0
    $clearLogBtn.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $clearLogBtn.Add_Click({ if ($script:logBox -ne $null) { $script:logBox.Clear() }; Write-InfoMsg "Log cleared." })
    $logCard.Controls.Add($clearLogBtn)

    # Use RichTextBox for colorized, monospace logs
    $script:logBox = New-Object System.Windows.Forms.RichTextBox
    $script:logBox.Location = New-Object System.Drawing.Point(15, 50)
    $script:logBox.Size = New-Object System.Drawing.Size(490, 360)
    $script:logBox.ReadOnly = $true
    $script:logBox.BackColor = $Color_LogBackground
    $script:logBox.ForeColor = $Color_TextPrimary
    $script:logBox.Font = New-Object System.Drawing.Font("Consolas", 9)
    $script:logBox.ScrollBars = "Vertical"
    $script:logBox.WordWrap = $false
    $logCard.Controls.Add($script:logBox)

    # Bottom READY status bar (prominent)
    $script:readyBar = New-Object System.Windows.Forms.Panel
    $script:readyBar.Location = New-Object System.Drawing.Point(0, 420)
    $script:readyBar.Size = New-Object System.Drawing.Size(520, 30)
    $script:readyBar.BackColor = $Color_Success
    $logCard.Controls.Add($script:readyBar)

    $script:readyLabel = New-Object System.Windows.Forms.Label
    $script:readyLabel.Location = New-Object System.Drawing.Point(10, 6)
    $script:readyLabel.Size = New-Object System.Drawing.Size(500, 18)
    $script:readyLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $script:readyLabel.ForeColor = [System.Drawing.Color]::White
    $script:readyLabel.Text = "READY: No recent tasks."
    $script:readyBar.Controls.Add($script:readyLabel)

    # Button Helpers
    function Add-CardHeader {
        param([string]$Text, [int]$YPos)
        $header = New-Object System.Windows.Forms.Label
        $header.Text = $Text
        $header.Location = New-Object System.Drawing.Point(20, $YPos)
        $header.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
        $header.ForeColor = $Color_PrimaryHeader
        $header.AutoSize = $true
        $contentPanel.Controls.Add($header)
        return $YPos + 30
    }

    function Create-FlowPanel {
        param([int]$YPos, [int]$Height)
        $panel = New-Object System.Windows.Forms.FlowLayoutPanel
        $panel.Location = New-Object System.Drawing.Point(10, $YPos)
        $panel.Size = New-Object System.Drawing.Size(500, $Height)
        $panel.BackColor = $Color_Panel
        $panel.Padding = New-Object System.Windows.Forms.Padding(10)
        $contentPanel.Controls.Add($panel)
        return $panel
    }
    
    function Add-Button {
        param(
            [System.Windows.Forms.FlowLayoutPanel]$Panel,
            [string]$Text,
            [scriptblock]$Action,
            [System.Drawing.Color]$BackColor,
            [System.Drawing.Color]$TextColor = [System.Drawing.Color]::White,
            [int]$Width = 100,
            [int]$Height = 40
        )
    $button = New-Object System.Windows.Forms.Button
        $button.Text = $Text
        $button.Size = New-Object System.Drawing.Size($Width, $Height)
        $button.Margin = New-Object System.Windows.Forms.Padding(5)
        $button.BackColor = $BackColor
        $button.ForeColor = $TextColor
        $button.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
        $button.FlatAppearance.BorderSize = 0
        $button.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
        
        # Apply consistent rounding and subtle border highlight
        try { Set-RoundedControl $button 6 } catch {}

        $button.Tag = @{ Action = $Action; TaskName = $Text }
        $button.Add_Click({
            param($sender, $e)
            $data = $sender.Tag
            Task-Wrapper $data.Action $data.TaskName
        })
        $Panel.Controls.Add($button)
    }
    
    function Add-SimpleButton {
        param(
            [System.Windows.Forms.FlowLayoutPanel]$Panel,
            [string]$Text,
            [scriptblock]$Action,
        [System.Drawing.Color]$BackColor = $Color_Secondary,
            [int]$Width = 140
        )
    $button = New-Object System.Windows.Forms.Button
        $button.Text = $Text
        $button.Size = New-Object System.Drawing.Size($Width, 40)
        $button.Margin = New-Object System.Windows.Forms.Padding(5)
        $button.BackColor = $BackColor
        $button.ForeColor = [System.Drawing.Color]::White
        $button.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
        $button.FlatAppearance.BorderSize = 0
        $button.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
        try { Set-RoundedControl $button 6 } catch {}
        $button.Add_Click($Action)
        $Panel.Controls.Add($button)
    }

    # Round control helper: sets a rounded region on controls (buttons/panels)
    function Set-RoundedControl {
        param([System.Windows.Forms.Control]$Control, [int]$Radius = 6)
        try {
            $w = $Control.Width
            $h = $Control.Height
            $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
            $d = $Radius * 2
            $gp.AddArc(0, 0, $d, $d, 180, 90)
            $gp.AddArc($w - $d - 1, 0, $d, $d, 270, 90)
            $gp.AddArc($w - $d - 1, $h - $d - 1, $d, $d, 0, 90)
            $gp.AddArc(0, $h - $d - 1, $d, $d, 90, 90)
            $gp.CloseFigure()
            $Control.Region = New-Object System.Drawing.Region($gp)
        } catch {}
    }

    function Add-Divider {
        param([int]$YPos)
        $div = New-Object System.Windows.Forms.Panel
        $div.Location = New-Object System.Drawing.Point(10, $YPos)
        $div.Size = New-Object System.Drawing.Size(500, 1)
        $div.BackColor = [System.Drawing.ColorTranslator]::FromHtml("#374151")
        $contentPanel.Controls.Add($div)
        return $YPos + 8
    }

    $yOffset = 10

    # Container Lifecycle Card (moved up for prominence)
    $yOffset = Add-CardHeader "Container Lifecycle" $yOffset
    $containerPanel = Create-FlowPanel $yOffset 70
    $yOffset += 80

    Add-Button $containerPanel "START Containers" { Start-Containers } $Color_Success
    Add-Button $containerPanel "STOP Containers" { Stop-Containers } $Color_Danger
    Add-Button $containerPanel "RESTART Containers" { Restart-Containers } $Color_Warn
    Add-Button $containerPanel "Status (Local)" { Show-ContainerStatus } $Color_Secondary

    # Quick Start Card
    $yOffset = Add-CardHeader "Quick Start" $yOffset
    $quickStartPanel = Create-FlowPanel $yOffset 70
    $yOffset += 80

    # Reduced prominence size for REBUILD ALL (still primary but not overwhelming)
    Add-Button $quickStartPanel "⚡ REBUILD ALL" { Rebuild-All } $Color_Success ([System.Drawing.Color]::Black) 320 46

    # Build & Deployment Card
    $yOffset = Add-CardHeader "Build & Deployment" $yOffset
    $buildDeployPanel = Create-FlowPanel $yOffset 70
    $yOffset += 80

    Add-Button $buildDeployPanel "Build BACKEND" { Build-Backend } $Color_AccentPurple
    Add-Button $buildDeployPanel "Build FRONTEND" { Build-Frontend } $Color_AccentPurple
    Add-Button $buildDeployPanel "Build Docker Images" { Build-DockerImages } $Color_AccentPurple
    Add-Button $buildDeployPanel "Push Images" { Push-Images } $Color_AccentPurple
    Add-Button $buildDeployPanel "Deploy to VPS" { Deploy-ToVPS $script:vpsDropdown.SelectedItem } $Color_Success

    # VPS Card
    $yOffset = Add-CardHeader "VPS" $yOffset
    $vpsPanel = Create-FlowPanel $yOffset 70
    $yOffset += 80

    Add-Button $vpsPanel "Deploy to VPS" { Deploy-LatestToVPS } $Color_Success 140
    Add-Button $vpsPanel "Show VPS Status" { Show-VPSStatus } $Color_Secondary 140
    Add-Button $vpsPanel "Restart VPS Services" { Restart-VPSServices } $Color_Warn 160
    Add-Button $vpsPanel "Start VPS Containers" { Start-VPSContainers } $Color_Success 160
    Add-Button $vpsPanel "Stop VPS Containers" { Stop-VPSContainers } $Color_Danger 160

    # System & Configuration Card
    $yOffset = Add-CardHeader "System & Configuration" $yOffset
    $systemConfigPanel = Create-FlowPanel $yOffset 70
    $yOffset += 80
    
    Add-Button $systemConfigPanel "Logs (Local)" { Show-Logs } $Color_Secondary
    Add-Button $systemConfigPanel "Push to GitHub" { Git-PushAction } $Color_Secondary
    Add-Button $systemConfigPanel "Connect to VPS (SSH)" { Connect-VPS } $Color_Secondary
    Add-SimpleButton $systemConfigPanel "Config Docker Hub" { Set-DockerHubConfig } $Color_Secondary
    Add-SimpleButton $systemConfigPanel "Config VPS" { Set-VPSConfig } $Color_Secondary
    Add-SimpleButton $systemConfigPanel "Help" { Show-Help } ([System.Drawing.ColorTranslator]::FromHtml("#8b5cf6"))
    
    # EXIT button
    $exitButton = New-Object System.Windows.Forms.Button
    $exitButton.Text = "EXIT"
    $exitButton.Location = New-Object System.Drawing.Point(20, 780)
    $exitButton.Size = New-Object System.Drawing.Size(100, 30)
    $exitButton.BackColor = $Color_Danger
    $exitButton.ForeColor = [System.Drawing.Color]::White
    $exitButton.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
    $exitButton.FlatAppearance.BorderSize = 0
    $exitButton.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $exitButton.Add_Click({ $script:mainForm.Close() })
    $script:mainForm.Controls.Add($exitButton)

    # Timer to update container status (local and VPS)
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 5000
    $timer.Add_Tick({
        try {
            # Update local container status
            $output = & docker ps --format "{{.Names}}" 2>$null
            foreach ($key in $script:containerStatus.Keys) {
                $containerName = "portal-" + $key.ToLower()
                if ($output -match $containerName) {
                    # indicator is a small panel; set BackColor for on/off
                    $script:containerStatus[$key].BackColor = $Color_Success
                } else {
                    $script:containerStatus[$key].BackColor = $Color_Danger
                }
            }

            # Update VPS container status
            $vpsOutput = Get-VPSContainerStatus
            if ($vpsOutput) {
                foreach ($key in $script:vpsContainerStatus.Keys) {
                    $containerName = "portal-" + $key.ToLower()
                    if ($vpsOutput -match $containerName) {
                        $script:vpsContainerStatus[$key].BackColor = $Color_Success
                    } else {
                        $script:vpsContainerStatus[$key].BackColor = $Color_Danger
                    }
                }
            } else {
                # If VPS query fails, mark all as offline
                foreach ($key in $script:vpsContainerStatus.Keys) {
                    $script:vpsContainerStatus[$key].BackColor = $Color_Danger
                }
            }
        } catch {}
    })
    $timer.Start()

    Load-Config
    Update-StatusBar "READY: Please select an action." $Color_TextPrimary

    [void]$script:mainForm.ShowDialog()
    $timer.Stop()
}

# ==============================================================================
# 5. EXECUTION
# ==============================================================================

Show-ProjectManagerGUI
