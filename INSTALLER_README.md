# Explorer AI - Professional Installer Guide

## Overview

This guide covers building and deploying the professional Explorer AI installer (Level 99).

## System Requirements

### For Installation
- **OS**: Windows 10 or Windows 11 (x64)
- **Processor**: 2.0 GHz or faster
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 2 GB available
- **Internet**: Optional (for updates and online features)

### For Building the Installer
- **Windows 7 or later** (x64)
- **NSIS 3.0 or later** - [Download](https://nsis.sourceforge.io/)
- **Administrator rights**

## Installation Methods

### Method 1: Standard GUI Installation (Recommended)
```batch
ExplorerAI-Setup-2.0.0-x64.exe. 
```
- Double-click the installer
- Follow the on-screen wizard
- Choose installation location and components
- Select optional features (desktop shortcut, auto-start, etc.)

### Method 2: Silent Installation (For IT Administrators)
```batch
ExplorerAI-Setup-2.0.0-x64.exe /S
```
- Installs with default settings
- No user interaction required
- Returns exit code 0 on success

### Method 3: Custom Installation
```batch
ExplorerAI-Setup-2.0.0-x64.exe /D=C:\CustomPath
```
- Specify custom installation directory
- Combine with /S for silent custom installation

## Installation Components

| Component | Required | Default | Description |
|-----------|----------|---------|-------------|
| Core Application | ✓ | ✓ | Main executable and libraries |
| Desktop Shortcut | | ✓ | Quick access from desktop |
| Start Menu Entry | | ✓ | Programs folder entry |
| Quick Launch | | | Quick launch bar icon |
| Auto-Start on Boot | | | Launch automatically on login |
| File Type Association | | | Open .conv files with Explorer AI |

## Building the Installer

### Prerequisites
1. Install NSIS from https://nsis.sourceforge.io/
2. Ensure ExplorerAI.exe is in the ExplorerAI folder
3. Verify LICENSE.txt exists

### Using Batch Script (Windows CMD)
```batch
cd c:\proj
BUILD_INSTALLER.bat
```

### Using PowerShell
```powershell
cd c:\proj
.\BUILD_INSTALLER.ps1
```

### Manual Build with NSIS
```batch
"C:\Program Files (x86)\NSIS\makensis.exe" /V4 ExplorerAI-Installer.nsi
```

## Post-Installation

### First Launch
1. Open Explorer AI from desktop shortcut or Start Menu
2. Grant Windows Defender SmartScreen approval (if prompted)
3. Choose your voice preferences
4. Configure microphone access when prompted

### Keyboard Shortcuts
- `Ctrl+N` - New chat
- `Ctrl+M` - Voice input
- `Ctrl+Enter` - Send message
- `Ctrl+K` - Search history
- `?` - Help menu

### Settings & Configuration
- Access settings from the sidebar "Settings" button
- Configure voice (speed, volume, pitch)
- Enable/disable real-time features
- Manage conversation history

## Uninstallation

### Standard Uninstall
1. Go to **Settings > Apps > Apps & features**
2. Find "Explorer AI"
3. Click and select "Uninstall"
4. Follow the uninstall wizard

### Command Line Uninstall
```batch
"C:\Program Files\ExplorerAI\uninstall.exe" /S
```

### Remove Shortcuts and Registry
The uninstaller automatically removes:
- Desktop shortcuts
- Start Menu entries
- File type associations
- Registry entries

## Troubleshooting

### Installation Fails
- **"Administrator rights required"**: Right-click installer → Run as Administrator
- **"NSIS Error"** (when building): Ensure NSIS is properly installed
- **Disk space error**: Free up at least 2 GB of disk space

### Application Won't Start
1. Verify installation: Check `C:\Program Files\ExplorerAI\ExplorerAI.exe` exists
2. Check Windows Defender: May have blocked the app
3. Reinstall: Uninstall completely and reinstall fresh
4. Check compatibility: Run in compatibility mode if needed

### Missing Features
- **Voice not working**: Enable microphone in Windows Settings
- **Location detection**: Allow location permission
- **Updates not available**: Check internet connection

## Advanced Configuration

### Portable Mode
To run without installation:
1. Extract `ExplorerAI.exe` and `_internal` folder
2. Place in desired location
3. Run ExplorerAI.exe directly

### Registry Settings
The installer creates registry entries at:
```
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\ExplorerAI
```

### Conversation Backup
Auto-backups are stored locally in:
```
%APPDATA%\Explorer AI\backups\
```

## Deployment for Organizations

### Group Policy Deployment
```batch
@echo off
REM Deploy Explorer AI via Group Policy
\\network\share\ExplorerAI-Setup-2.0.0-x64.exe /S /D=%PROGRAMFILES%\ExplorerAI
```

### MDM/Intune
Contact support@explorer-ai.com for enterprise deployment options.

## Version History

### v2.0.0 (Current)
- Professional installer with full customization
- Auto-backup and settings persistence
- Enhanced keyboard shortcuts
- Message timestamps and copy functionality
- Export conversations (TXT, JSON, Markdown)
- Admin deployment support

### v1.0.0 (Previous)
- Initial release
- Basic chat functionality
- Voice input/output support
- Offline mode

---

**Installer Version**: 2.0.0  
**Last Updated**: April 2026  
**Build**: Professional Level 99
