# Explorer AI

Lightweight project files copied from the packaged Explorer AI build. This repo keeps the runnable UI/source assets and ignores installer output, downloaded dependencies, virtual environments, and compiled binaries.

## Run the app

Start the backend from the project root:

```powershell
python backend\server.py
```

In another terminal, start the frontend:

```powershell
python -m http.server 8000 -d frontend
```

Then open:

```text
http://localhost:8000
```

The frontend runs in a browser for layout/demo testing. Chat, history, and location fallback calls are connected to the local backend at `http://127.0.0.1:8001/api`. Desktop-only voice capture still requires the original `pywebview` app shell.

## Project Layout

```text
frontend/
  index.html
  style.css
  script.js
  app-icon.png
  app-icon.svg
backend/
  server.py
  chat_history.json
  app-config.json
  data/
    survival_qa.json
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
