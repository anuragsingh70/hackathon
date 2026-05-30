from __future__ import annotations

import json
import math
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import request


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "survival_qa.json"
HISTORY_FILE = BASE_DIR / "chat_history.json"


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


QA_DATA = load_json(DATA_FILE, [])


def normalize(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", (text or "").lower())
    stop_words = {
        "a",
        "an",
        "and",
        "are",
        "can",
        "do",
        "for",
        "how",
        "i",
        "if",
        "in",
        "is",
        "it",
        "me",
        "my",
        "of",
        "or",
        "should",
        "the",
        "to",
        "what",
    }
    return {word for word in words if word not in stop_words}


def score_entry(message: str, entry: dict) -> float:
    message_terms = normalize(message)
    if not message_terms:
        return 0

    candidates = []
    for question in entry.get("questions", []):
        candidates.append(set(normalize(question)))
    candidates.append(set(normalize(" ".join(entry.get("tags", [])))))

    best = 0.0
    for terms in candidates:
        if not terms:
            continue
        overlap = len(message_terms & terms)
        coverage = overlap / math.sqrt(len(message_terms) * len(terms))
        best = max(best, coverage)
    return best


def answer_for(message: str) -> str:
    best = max(QA_DATA, key=lambda entry: score_entry(message, entry), default=None)
    if not best or score_entry(message, best) < 0.18:
        return (
            "I could not find a solid survival answer for that yet. Try asking about "
            "getting lost, water, fire, shelter, food, first aid, weather, or rescue."
        )

    answer = best.get("answer", [])
    if isinstance(answer, list):
        return "\n\n".join(f"{index}. {line}" for index, line in enumerate(answer, start=1))
    return str(answer)


def get_ip_location() -> dict:
    try:
        with request.urlopen("https://ipapi.co/json/", timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
        lat = data.get("latitude")
        lon = data.get("longitude")
        return {
            "ok": lat is not None and lon is not None,
            "lat": lat,
            "lon": lon,
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country_name"),
            "message": "Approximate location found.",
        }
    except Exception:
        return {"ok": False, "message": "Network location lookup is unavailable."}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return

    def send_json(self, status: int, payload) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def read_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_OPTIONS(self) -> None:
        self.send_json(204, {})

    def do_GET(self) -> None:
        if self.path == "/api/health":
            self.send_json(200, {"ok": True})
        elif self.path == "/api/history":
            self.send_json(200, load_json(HISTORY_FILE, []))
        elif self.path == "/api/ip-location":
            self.send_json(200, get_ip_location())
        else:
            self.send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path == "/api/chat":
            payload = self.read_body()
            message = str(payload.get("message", "")).strip()
            response = answer_for(message)
            history = load_json(HISTORY_FILE, [])
            history.append({"user": message, "ai": response})
            save_json(HISTORY_FILE, history)
            self.send_json(200, {"response": response})
        elif self.path == "/api/clear-history":
            save_json(HISTORY_FILE, [])
            self.send_json(200, {"ok": True})
        elif self.path in {"/api/speak", "/api/set-voice", "/api/set-speed", "/api/set-volume"}:
            self.send_json(200, {"status": "ok"})
        elif self.path == "/api/voice-input":
            self.send_json(200, {"text": "Voice input is only available in the desktop app."})
        else:
            self.send_json(404, {"error": "Not found"})


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8001), Handler)
    print("Explorer AI backend running at http://127.0.0.1:8001")
    server.serve_forever()


if __name__ == "__main__":
    main()
