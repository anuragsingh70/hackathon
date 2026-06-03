# API Documentation

## Overview

The Explorer AI backend provides RESTful API endpoints for chat, location services, and conversation history management.

## Base URL

- **Local Development**: `http://127.0.0.1:8001/api`
- **Production (Vercel)**: `/api`

## Authentication

Currently, the API uses no authentication. For production deployment, consider implementing:
- API key validation
- JWT tokens
- Rate limiting by client

## Endpoints

### 1. Chat Endpoint

Send a message and get a survival-related response.

**Endpoint**: `POST /api/chat`

**Request**:
```json
{
  "message": "How do I start a fire?",
  "session_id": "optional-session-id"
}
```

**Response - Success**:
```json
{
  "status": "success",
  "response": "To start a fire without matches...",
  "category": "fire",
  "confidence": 0.95
}
```

**Response - No Match**:
```json
{
  "status": "no_match",
  "response": "I don't have information about that topic...",
  "suggestions": ["fire", "shelter", "water"]
}
```

**Response - Error**:
```json
{
  "status": "error",
  "error": "Invalid request",
  "details": "Message cannot be empty"
}
```

**Status Codes**:
- `200 OK` - Request successful
- `400 Bad Request` - Invalid input
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### 2. Chat History Endpoint

Retrieve conversation history.

**Endpoint**: `GET /api/history`

**Response**:
```json
{
  "status": "success",
  "history": [
    {
      "timestamp": "2026-06-03T10:30:00Z",
      "user_message": "How do I build a shelter?",
      "bot_response": "To build a shelter...",
      "category": "shelter"
    }
  ],
  "total": 42
}
```

### 3. Clear History Endpoint

Clear all chat history.

**Endpoint**: `POST /api/clear-history`

**Response**:
```json
{
  "status": "success",
  "message": "Chat history cleared"
}
```

### 4. Location Endpoint

Get location-based survival recommendations.

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
  "status": "success",
  "location": "New York, NY, USA",
  "altitude": 10,
  "climate": "temperate",
  "timezone": "America/New_York",
  "regional_tips": [
    "Urban areas have limited natural resources...",
    "Winter temperatures can drop below 0°F..."
  ]
}
```

### 5. IP Location Endpoint

Get location from IP address.

**Endpoint**: `GET /api/ip-location`

**Response**:
```json
{
  "status": "success",
  "ip": "203.0.113.42",
  "location": "San Francisco, CA, USA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "timezone": "America/Los_Angeles"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "error": "Error type",
  "details": "Detailed error message"
}
```

### Common Error Types

| Error | Status | Description |
|-------|--------|-------------|
| `INVALID_INPUT` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `NOT_FOUND` | 404 | Resource not found |

## Rate Limiting

- **Limit**: 100 requests per minute per client
- **Header**: `X-RateLimit-Remaining` indicates remaining requests

## Request/Response Formats

- **Content-Type**: `application/json` (required)
- **Character Encoding**: UTF-8
- **Max Request Size**: 5MB

## CORS Policy

- **Allowed Origins**: `localhost:*`, `*.vercel.app`
- **Allowed Methods**: `GET`, `POST`, `OPTIONS`
- **Allowed Headers**: `Content-Type`, `Authorization`

## Examples

### cURL Examples

**Chat Request**:
```bash
curl -X POST http://127.0.0.1:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I find clean water?"}'
```

**Location Request**:
```bash
curl -X POST http://127.0.0.1:8001/api/location \
  -H "Content-Type: application/json" \
  -d '{"latitude": 40.7128, "longitude": -74.0060}'
```

### Python Examples

```python
import requests
import json

BASE_URL = "http://127.0.0.1:8001/api"

# Chat request
response = requests.post(
    f"{BASE_URL}/chat",
    headers={"Content-Type": "application/json"},
    json={"message": "How do I survive in the desert?"}
)
print(response.json())

# Location request
response = requests.post(
    f"{BASE_URL}/location",
    headers={"Content-Type": "application/json"},
    json={"latitude": 40.7128, "longitude": -74.0060}
)
print(response.json())
```

## Versioning

- **Current Version**: 2.0.0
- **API Version**: v1
- **Deprecation Policy**: Deprecated endpoints will be marked with a sunset date

## Support

For API issues and questions:
- Email: `support@explorer-ai.com`
- Documentation: https://explorer-ai.com/docs
- GitHub Issues: Report bugs and feature requests
