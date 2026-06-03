# Explorer AI

An intelligent survival knowledge chatbot powered by AI. Explorer AI provides instant answers to survival-related questions, chat history tracking, and location-based services. Built with Python backend and vanilla JavaScript frontend.

## Features

- **AI-Powered Q&A**: Ask survival-related questions and get instant answers
- **Chat History**: Persistent storage of your conversation history
- **Location Services**: Integrated location-based fallback functionality
- **Voice Support**: Desktop app with voice capture capabilities
- **Cross-Platform**: Run locally on Windows/Mac/Linux or deploy to Vercel
- **Lightweight**: No external API dependencies (can run with Python standard library only)

## Quick Start

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Local Development

1. **Start the Backend**

From the project root:

```powershell
python backend\server.py
```

The backend runs on `http://127.0.0.1:8001`

2. **Start the Frontend**

In another terminal:

```powershell
python -m http.server 8000 -d frontend
```

The frontend runs on `http://localhost:8000`

3. **Open in Browser**

```
http://localhost:8000
```

### Installation for Desktop App

1. Create a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

2. For offline installation, download requirements:

```powershell
.\scripts\download_requirements.bat
```

Downloaded wheels are saved to `offline_packages/`

## Project Structure

```
explorer-ai/
├── frontend/                 # Web UI
│   ├── index.html           # HTML markup
│   ├── style.css            # Styling
│   ├── script.js            # Application logic
│   ├── app-icon.png         # App icon (PNG)
│   └── app-icon.svg         # App icon (SVG)
├── backend/                 # Python backend
│   ├── server.py            # HTTP server & API handlers
│   ├── __init__.py
│   ├── app-config.json      # Configuration file
│   ├── chat_history.json    # User chat history
│   └── data/
│       └── survival_qa.json # Q&A knowledge base
├── api/                     # API route handlers
│   └── index.py
├── scripts/                 # Utility scripts
│   ├── download_requirements.bat
│   └── download_requirements.sh
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel deployment config
├── readme.md               # This file
├── user_manual.md          # End-user guide
├── agents.md               # AI agent documentation
└── CONTRIBUTING.md         # Contribution guidelines
```

## API Endpoints

### `POST /api/chat`

Send a message to the chatbot.

**Request:**
```json
{
  "message": "How do I start a fire?"
}
```

**Response:**
```json
{
  "response": "To start a fire safely...",
  "sources": ["survival_qa.json"]
}
```

### `GET /api/history`

Retrieve chat history.

**Response:**
```json
{
  "history": [
    {
      "user": "message text",
      "bot": "response text",
      "timestamp": "2026-05-31T10:30:00Z"
    }
  ]
}
```

### `POST /api/location`

Get location-based services.

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

## Configuration

Edit `backend/app-config.json` to customize:

- Server port
- Response timeout
- History limits
- Data file paths

## Deployment

### Vercel

1. Push your repository to GitHub
2. Import in Vercel dashboard
3. Use these settings:

```
Framework Preset: Other
Root Directory: ./
Build Command: None
Output Directory: frontend
Install Command: echo "No install required"
```

The `vercel.json` automatically routes:
- `http://yourapp.vercel.app/` → Frontend
- `http://yourapp.vercel.app/api/*` → Python backend

**Note**: Vercel deployment uses only Python standard library. External packages require serverless function adaptation.

## Dependencies

See [requirements.txt](requirements.txt) for complete list. Main dependencies:

- `pywebview` (2.3.0+) - Desktop app container
- `requests` - HTTP client for location services
- Python standard library only for Vercel deployment

## Troubleshooting

### Backend not responding

- Ensure Python 3.7+ is installed: `python --version`
- Check if port 8001 is available
- Verify `survival_qa.json` exists in `backend/data/`

### Frontend can't reach backend

- Confirm both servers are running
- Check browser console for CORS errors
- Ensure firewall isn't blocking localhost:8001

### Chat history not saving

- Verify `backend/` directory has write permissions
- Check console for JSON serialization errors
- Ensure valid UTF-8 encoding in `chat_history.json`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code style guidelines
- Pull request process
- Testing requirements
- Issue reporting

## User Guide

For end-user documentation, see [user_manual.md](user_manual.md)

## AI Agent Documentation

For technical details on AI features, see [agents.md](agents.md)

## Version

Current version: See `VERSION_COMPARISON` file for version history

---

**Explorer AI** - Survival Knowledge at Your Fingertips
