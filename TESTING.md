# Testing Guide

## Overview

This document outlines the testing strategy for Explorer AI, including unit tests, integration tests, and testing best practices.

## Test Structure

```
explorer-ai/
├── tests/
│   ├── __init__.py
│   ├── test_utils.py           # Unit tests for utilities
│   ├── test_backend.py         # Backend integration tests
│   └── test_frontend.py        # Frontend tests
├── pytest.ini                  # Pytest configuration
└── .coverage                   # Coverage report
```

## Unit Tests

### Testing Utilities

The `backend/utils.py` module includes comprehensive utilities with test coverage:

```bash
# Run utility tests
pytest tests/test_utils.py -v

# Run with coverage
pytest tests/test_utils.py --cov=backend.utils
```

### Test Categories

1. **Validator Tests**: Input validation for messages, JSON, and coordinates
2. **Logger Tests**: Logging functionality and singleton pattern
3. **RateLimiter Tests**: Rate limiting behavior and client tracking

## Integration Tests

### Backend Integration

Test the backend server endpoints:

```python
# tests/test_backend.py

import requests
import pytest

BASE_URL = "http://127.0.0.1:8001/api"

class TestChatEndpoint:
    def test_chat_valid_message(self):
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": "How do I start a fire?"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"
    
    def test_chat_empty_message(self):
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": ""}
        )
        assert response.status_code == 400
```

### Frontend Integration

Test frontend functionality:

```javascript
// tests/test_frontend.js

describe('Chat Interface', () => {
    it('should send message and display response', async () => {
        const input = document.getElementById('input');
        input.value = 'How do I build a shelter?';
        
        const sendButton = document.querySelector('button');
        sendButton.click();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const messages = document.querySelectorAll('.message');
        expect(messages.length).toBeGreaterThan(0);
    });
});
```

## Running Tests

### Setup

```bash
# Install test dependencies
pip install pytest pytest-cov pytest-asyncio

# Create tests directory if not exists
mkdir -p tests
touch tests/__init__.py
```

### Run All Tests

```bash
# Basic test run
pytest

# Verbose output
pytest -v

# With coverage report
pytest --cov=backend --cov-report=html

# Specific test file
pytest tests/test_utils.py

# Specific test class
pytest tests/test_utils.py::TestValidator

# Specific test method
pytest tests/test_utils.py::TestValidator::test_validate_message_success
```

### Test Markers

```bash
# Run only fast tests
pytest -m "not slow"

# Run only integration tests
pytest -m integration

# Run tests matching pattern
pytest -k "validate"
```

## Coverage

### Generate Coverage Report

```bash
# Generate HTML coverage report
pytest --cov=backend --cov-report=html

# Open report
# coverage_html_report/index.html
```

### Coverage Targets

- **Utilities**: 90%+ coverage
- **Backend**: 80%+ coverage
- **Frontend**: 70%+ coverage

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/tests.yml

name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov
    
    - name: Run tests
      run: pytest --cov=backend
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
```

## Manual Testing

### Smoke Tests

Basic functionality verification:

```bash
# Start backend
python backend/server.py

# Test in another terminal
curl -X POST http://127.0.0.1:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I survive?"}'
```

### User Acceptance Testing

1. **Chat Interface**
   - [ ] Can send message
   - [ ] Receives response
   - [ ] History displays correctly
   - [ ] Can clear history

2. **Location Features**
   - [ ] Can share location
   - [ ] Receives location info
   - [ ] Gets regional tips

3. **Voice Features** (if enabled)
   - [ ] Voice input works
   - [ ] Voice output works
   - [ ] Settings persist

4. **Error Handling**
   - [ ] Empty message shows error
   - [ ] Invalid input handled
   - [ ] Network errors show message

## Performance Testing

### Load Testing with Locust

```python
# locustfile.py

from locust import HttpUser, between, task

class ExplorerAIUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def chat(self):
        self.client.post("/api/chat", json={
            "message": "How do I start a fire?"
        })
    
    @task
    def get_history(self):
        self.client.get("/api/history")

# Run: locust -f locustfile.py
```

### Benchmarking

```python
# benchmark.py

import time
from backend.server import answer_for

queries = [
    "How do I start a fire?",
    "How do I find water?",
    "How do I build a shelter?"
]

for query in queries:
    start = time.time()
    answer = answer_for(query)
    elapsed = time.time() - start
    print(f"{query}: {elapsed:.3f}s")
```

## Debugging Tests

### Verbose Output

```bash
# Show print statements
pytest -s

# Show all local variables
pytest -l

# Debug with breakpoint
pytest --pdb
```

### Test Debugging Example

```python
import pytest

@pytest.fixture
def debug_info():
    """Provide debug information."""
    return {"verbose": True}

def test_with_debug(debug_info):
    if debug_info["verbose"]:
        pytest.set_trace()  # Breakpoint
```

## Best Practices

### Test Organization

1. **One concern per test**: Test single functionality
2. **Descriptive names**: Test name should describe what's tested
3. **Arrange-Act-Assert**: Clear test structure

```python
def test_rate_limiter_blocks_excess_requests():
    # Arrange
    limiter = RateLimiter(max_requests=2)
    
    # Act
    result1 = limiter.is_allowed("client")
    result2 = limiter.is_allowed("client")
    result3 = limiter.is_allowed("client")
    
    # Assert
    assert result1 is True
    assert result2 is True
    assert result3 is False
```

### Fixtures and Mocking

```python
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_database():
    """Mock database connection."""
    return MagicMock()

def test_with_mock(mock_database):
    mock_database.query.return_value = []
    result = process_query(mock_database)
    assert result == []
```

### Test Data

```python
# fixtures.py

import pytest

@pytest.fixture
def sample_qa_data():
    return [
        {
            "questions": ["How do I start a fire?"],
            "answer": "Gather dry wood...",
            "tags": ["fire", "survival"]
        }
    ]

# Use in tests
def test_scoring(sample_qa_data):
    score = score_entry("fire", sample_qa_data[0])
    assert score > 0
```

## Test Reporting

### Generate Report

```bash
# HTML report
pytest --html=report.html --self-contained-html

# JUnit XML report
pytest --junit-xml=report.xml

# Coverage badge
coverage-badge -o coverage.svg
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Import errors | Ensure `__init__.py` exists in test directories |
| Fixture not found | Check fixture scope and registration |
| Tests timeout | Increase timeout or optimize test speed |
| Mock not working | Verify patch path and mock setup |

## Contributing Tests

When contributing to Explorer AI:

1. Write tests for new features
2. Ensure existing tests pass
3. Maintain or improve code coverage
4. Follow naming conventions
5. Document complex test scenarios

---

Last Updated: June 2026
