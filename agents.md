# Explorer AI - Agent Documentation

Technical documentation for Explorer AI's AI agents and backend systems.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Chat Agent](#chat-agent)
3. [Knowledge Base](#knowledge-base)
4. [Response Generation](#response-generation)
5. [Location Agent](#location-agent)
6. [Session Management](#session-management)
7. [API Reference](#api-reference)
8. [Configuration](#configuration)

## System Architecture

```
┌─────────────┐
│   Frontend  │
│  (HTML/CSS/ │
│     JS)     │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────────┐
│   Backend HTTP Server       │
│   (Python ThreadingServer)  │
└──────┬──────────────────────┘
       │
       ├─── Chat Agent
       ├─── History Manager
       ├─── Location Agent
       └─── Config Manager
       │
       ▼
┌──────────────────────┐
│   Data Layer         │
├──────────────────────┤
│ survival_qa.json     │
│ chat_history.json    │
│ app-config.json      │
└──────────────────────┘
```

## Chat Agent

The chat agent is the core component for processing user questions and generating responses.

### How It Works

1. **Query Normalization**
   - Convert input to lowercase
   - Remove special characters
   - Extract keywords (stop word removal)
   - Create word set for matching

2. **Knowledge Base Search**
   - Compare user query words against Q&A entries
   - Calculate relevance score based on keyword overlap
   - Rank results by relevance

3. **Response Selection**
   - Choose top matching Q&A pair
   - Return answer from knowledge base
   - Include confidence metadata

4. **Response Validation**
   - Check response quality
   - Add source information
   - Format for frontend display

### Code Location

**File**: [backend/server.py](backend/server.py)

**Key Functions**:
- `normalize(text)` - Text preprocessing and tokenization
- `find_answer(query)` - Q&A search and matching
- `ChatHandler.do_POST()` - API endpoint handler

### Performance Considerations

- **Speed**: O(n) search through Q&A database
- **Accuracy**: Keyword-based matching without NLP
- **Scalability**: Performance degrades linearly with database size

### Example Agent Flow

```python
# User input
user_query = "How do I start a fire?"

# Step 1: Normalize
normalized = normalize(user_query)
# Result: {"how", "do", "i", "start", "a", "fire"}

# Step 2: Search knowledge base
matches = []
for qa in QA_DATA:
    score = len(normalized & normalize(qa["question"]))
    if score > 0:
        matches.append((qa, score))

# Step 3: Sort and return top result
best_match = sorted(matches, key=lambda x: x[1], reverse=True)[0]
response = best_match[0]["answer"]
```

## Knowledge Base

### Data Structure

**File**: [backend/data/survival_qa.json](backend/data/survival_qa.json)

**Format**:
```json
[
  {
    "question": "How do I start a fire without matches?",
    "answer": "You can use...",
    "category": "fire",
    "difficulty": "intermediate"
  },
  ...
]
```

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | User query or topic |
| `answer` | string | Yes | Response text (supports HTML) |
| `category` | string | No | Topic classification (e.g., "fire", "shelter") |
| `difficulty` | string | No | Skill level (beginner/intermediate/advanced) |
| `sources` | array | No | Reference materials |
| `keywords` | array | No | Search optimization terms |

### Categories

Supported categories in the knowledge base:

- **fire** - Fire starting, maintenance, safety
- **shelter** - Building structures, weather protection
- **water** - Finding, purifying, storing water
- **food** - Foraging, hunting, preservation
- **navigation** - Compass, stars, landmarks
- **first-aid** - Injury treatment, basic medicine
- **signaling** - Rescue signals, communication
- **weather** - Prediction, protection, seasonal
- **tools** - Crafting, improvisation, repair
- **psychology** - Survival mindset, fear management

### Adding New Q&A Pairs

1. Edit `backend/data/survival_qa.json`
2. Add entry with required fields
3. Restart backend: `python backend\server.py`
4. Test via frontend

Example:
```json
{
  "question": "How do I purify water using boiling?",
  "answer": "Boil water for at least 1 minute (3 minutes above 6,500 ft)...",
  "category": "water",
  "difficulty": "beginner"
}
```

## Response Generation

### Process Flow

```
User Query
    ↓
[Normalize] → Extract keywords
    ↓
[Search] → Find matching Q&A pairs
    ↓
[Rank] → Sort by relevance score
    ↓
[Format] → Prepare response object
    ↓
[Send] → Return to frontend
```

### Response Format

**Successful Response**:
```json
{
  "status": "success",
  "response": "Full answer text...",
  "question_matched": "matched question from DB",
  "confidence": 0.95,
  "category": "fire"
}
```

**No Match Response**:
```json
{
  "status": "no_match",
  "response": "I don't have information about that topic...",
  "suggestions": ["Related topic 1", "Related topic 2"]
}
```

**Error Response**:
```json
{
  "status": "error",
  "error": "Error message",
  "details": "..."
}
```

## Location Agent

### Purpose

Provides location-based survival recommendations and nearby resource information.

### Functionality

- **Location Retrieval**: Get user's current coordinates
- **Geocoding**: Convert coordinates to location name
- **Regional Advice**: Provide location-specific tips
- **Resource Mapping**: Find nearby water, shelter, etc.

### API Endpoint

**Endpoint**: `POST /api/location`

**Request**:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response**:
```json
{
  "location": "New York, NY, USA",
  "altitude": 10,
  "climate": "temperate",
  "nearest_water": "Hudson River (0.5 mi)",
  "regional_tips": [
    "New York winters are harsh...",
    "Urban areas have good shelter options..."
  ]
}
```

### Implementation

**File**: [backend/server.py](backend/server.py)

**Key Function**: `LocationHandler.do_POST()`

### Privacy & Data Handling

- Location data is processed on-device
- No persistent storage of coordinates
- Coordinates are used only for current session
- Complies with browser privacy APIs

## Session Management

### Chat History

**File**: [backend/chat_history.json](backend/chat_history.json)

**Structure**:
```json
[
  {
    "timestamp": "2026-05-31T10:30:00Z",
    "user_message": "How do I build a shelter?",
    "bot_response": "To build a shelter...",
    "category": "shelter",
    "session_id": "abc123"
  }
]
```

### History Operations

#### Get History
**Endpoint**: `GET /api/history`

**Response**:
```json
{
  "status": "success",
  "history": [
    {
      "timestamp": "...",
      "user_message": "...",
      "bot_response": "...",
      "category": "..."
    }
  ],
  "total": 42
}
```

#### Clear History
**Endpoint**: `POST /api/history/clear`

**Request**: (empty body)

**Response**:
```json
{
  "status": "success",
  "message": "Chat history cleared"
}
```

### Session Lifecycle

```
[User Opens App]
    ↓
[Check for existing session_id]
    ↓
[Load chat history] ← From chat_history.json
    ↓
[Display messages in UI]
    ↓
[User sends message]
    ↓
[Add to history] → Save to chat_history.json
    ↓
[User closes app]
    ↓
[History persisted for next session]
```

## API Reference

### Chat Endpoint

**URL**: `POST /api/chat`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "User's question here",
  "session_id": "optional-session-id",
  "conversation_id": "optional-thread-id"
}
```

**Response**:
```json
{
  "status": "success|error|no_match",
  "response": "Answer text",
  "metadata": {
    "processed_time_ms": 45,
    "confidence": 0.92,
    "source": "survival_qa.json"
  }
}
```

### Headers Handled

- `Content-Type`: application/json
- `User-Agent`: Client identification
- `Origin`: CORS validation (localhost only)

## Configuration

### Configuration File

**Location**: [backend/app-config.json](backend/app-config.json)

**Structure**:
```json
{
  "server": {
    "host": "127.0.0.1",
    "port": 8001,
    "timeout": 30
  },
  "database": {
    "qa_file": "data/survival_qa.json",
    "history_file": "chat_history.json"
  },
  "features": {
    "voice_enabled": false,
    "location_enabled": true,
    "history_enabled": true,
    "max_history_size": 10000
  },
  "search": {
    "min_confidence": 0.3,
    "max_results": 5,
    "timeout_seconds": 5
  }
}
```

### Environment Variables

- `VERCEL`: Set automatically on Vercel deployment
  - Disables local file writes
  - Uses read-only database
  - Optimizes for serverless

### Performance Tuning

**For Production**:
- Increase `server.timeout` to 60 seconds
- Set `search.max_results` to 3
- Enable caching for Q&A database
- Use async I/O for file operations

**For Development**:
- Set `search.min_confidence` to 0.1 for testing
- Enable verbose logging
- Use lower `timeout` for quick feedback

---

## Integration Testing

### Testing Chat Agent

```python
# Manual test
python backend/server.py

# In another terminal
curl -X POST http://127.0.0.1:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I start a fire?"}'
```

### Testing Location Agent

```python
curl -X POST http://127.0.0.1:8001/api/location \
  -H "Content-Type: application/json" \
  -d '{"latitude": 40.7128, "longitude": -74.0060}'
```

---

**For user documentation, see**: [user_manual.md](user_manual.md)

**For contribution guidelines, see**: [CONTRIBUTING.md](CONTRIBUTING.md)
