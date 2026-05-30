# Explorer AI

Lightweight project files copied from the packaged Explorer AI build. This repo keeps the runnable UI/source assets and ignores installer output, downloaded dependencies, virtual environments, and compiled binaries.

## Run the UI

From the project root:

```powershell
python -m http.server 8000 -d ui
```

Then open:

```text
http://localhost:8000
```

The UI runs in a browser for layout/demo testing. Chat, speech, and app-native APIs require the original `pywebview` backend, so those features will show backend/voice warnings in plain browser mode.

## Project Layout

```text
ui/
  index.html
  style.css
  script.js
  app-icon.png
  app-icon.svg
scripts/
  download_requirements.bat
  download_requirements.sh
requirements.txt
.gitignore
```

## Dependencies

Python dependencies are listed in `requirements.txt`. For local app/backend work, create a virtual environment first:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

To download packages for offline installation:

```powershell
.\scripts\download_requirements.bat
```

Downloaded wheels are saved to `offline_packages/`, which is intentionally ignored by Git.
