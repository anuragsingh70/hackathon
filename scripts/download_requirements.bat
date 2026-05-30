@echo off
setlocal

REM Directory where downloaded packages will be stored
set OUTDIR=offline_packages
if not exist "%OUTDIR%" mkdir "%OUTDIR%"

REM Download all packages (including dependencies) listed in requirements.txt
python -m pip download -r requirements.txt -d "%OUTDIR%"

echo Downloaded packages to %OUTDIR%
