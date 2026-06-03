# Contributing to Explorer AI

Thank you for your interest in contributing to Explorer AI! This document provides guidelines and instructions for participating in the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Coding Standards](#coding-standards)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Reporting Issues](#reporting-issues)
11. [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our code of conduct:

- **Be Respectful**: Treat all contributors with respect and courtesy
- **Be Inclusive**: Welcome people of all backgrounds and experience levels
- **Be Constructive**: Provide helpful feedback and assume good intent
- **Be Professional**: Keep discussions focused and professional
- **Report Issues**: Notify maintainers of code of conduct violations

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Offensive language or personal attacks
- Doxxing or sharing private information
- Trolling or intentionally disruptive behavior
- Spam or self-promotion

## Getting Started

### Prerequisites

- Python 3.7 or higher
- Git
- GitHub account
- Text editor or IDE (VS Code recommended)
- Basic command line knowledge

### Fork & Clone

1. **Fork the Repository**
   - Click "Fork" on the GitHub repository page
   - This creates your own copy

2. **Clone Your Fork**
   ```powershell
   git clone https://github.com/YOUR-USERNAME/explorer-ai.git
   cd explorer-ai
   ```

3. **Add Upstream Remote**
   ```powershell
   git remote add upstream https://github.com/ORIGINAL-REPO/explorer-ai.git
   ```

## Development Setup

### Create Virtual Environment

```powershell
# Windows
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### Install Dependencies

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Verify Installation

```powershell
# Start backend
python backend\server.py

# In another terminal
python -m http.server 8000 -d frontend
```

Visit `http://localhost:8000` to verify everything works.

## Making Changes

### Create a Feature Branch

```powershell
git checkout -b feature/your-feature-name
```

**Branch Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

Examples:
- `feature/voice-transcription`
- `fix/location-parsing-bug`
- `docs/api-reference`

### Keep Your Branch Updated

```powershell
git fetch upstream
git rebase upstream/main
```

## Commit Guidelines

### Commit Messages

Use clear, descriptive commit messages:

**Format**:
```
[Type] Short description (50 chars max)

Longer explanation if needed (72 chars per line)
Explain what and why, not how.
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions/modifications
- `chore:` - Build process, dependencies

**Examples**:
```
feat: Add voice input support for chat

- Integrate Web Speech API for voice recognition
- Add microphone permission handling
- Store voice input as alternative to text

Fixes #123
```

```
fix: Correct location parsing for coordinates

Previously latitude/longitude were swapped in API response.
Now correctly maps to expected format.
```

### Good Commit Practices

- **One feature per commit**: Keep commits focused
- **Test before committing**: Ensure code works
- **Meaningful messages**: Help future developers understand changes
- **Small commits**: Easier to review and revert if needed

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```powershell
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test locally**
   ```powershell
   # Run backend
   python backend\server.py
   
   # Run frontend
   python -m http.server 8000 -d frontend
   
   # Test your changes in browser
   ```

3. **Check code style**
   - Run linters (if configured)
   - Follow [Coding Standards](#coding-standards)

4. **Update documentation**
   - Update README if needed
   - Add docstrings to new functions
   - Document new API endpoints

### Submitting a Pull Request

1. **Push to Your Fork**
   ```powershell
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Set base to `main` branch

3. **Fill in PR Template**
   - **Title**: Clear, concise description
   - **Description**: Explain changes
   - **Related Issues**: Reference issue numbers (#123)
   - **Changes**: List what was modified
   - **Testing**: Describe how to test changes

### PR Template Example

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactor

## Related Issues
Fixes #123
Related to #456

## Testing
How to verify these changes:
1. Start backend: `python backend\server.py`
2. Start frontend: `python -m http.server 8000 -d frontend`
3. Test [specific scenario]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code changes
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new errors introduced
```

### Review Process

Maintainers will:
1. Review code for quality and style
2. Check for tests and documentation
3. Verify changes work correctly
4. Request changes if needed
5. Approve and merge when ready

**Timeline**: Expect review within 3-5 business days.

## Coding Standards

### Python Style Guide

Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) guidelines:

```python
# Good
def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates."""
    # Implementation here
    return distance

# Bad
def calc_dist(l1,l2,l3,l4):
    return distance
```

### Naming Conventions

- **Functions/Variables**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private members**: `_leading_underscore`

```python
# Good
class ChatHandler:
    MAX_HISTORY = 1000
    
    def process_message(self, text):
        _normalized = self._normalize(text)
        return _normalized

# Bad
class chatHandler:
    max_history = 1000
    
    def ProcessMessage(self, text):
        normalized = self.normalize(text)
        return normalized
```

### Documentation

**Docstrings** (Google style):

```python
def find_answer(query: str) -> dict:
    """Find best matching answer for a query.
    
    Args:
        query (str): User's question text
        
    Returns:
        dict: Response with keys 'answer', 'confidence', 'source'
        
    Raises:
        ValueError: If query is empty or None
        
    Example:
        >>> find_answer("How do I start a fire?")
        {'answer': 'To start a fire...', 'confidence': 0.95}
    """
```

### Code Comments

```python
# Use comments to explain WHY, not WHAT
# BAD: increment counter
i = i + 1

# GOOD: Move to next message in history
message_index += 1

# Complex logic needs explanation
# Normalize query by removing stop words for better matching
normalized_query = normalize_text(query)
```

## Testing

### Writing Tests

Tests help ensure code quality and prevent regressions.

```python
# test_chat_agent.py
def test_normalize():
    """Test text normalization removes stop words."""
    input_text = "How do I start a fire?"
    result = normalize(input_text)
    assert "do" not in result  # stop words removed
    assert "how" not in result
    assert "fire" in result

def test_find_answer_basic():
    """Test finding answer for basic question."""
    answer = find_answer("How do I start a fire?")
    assert answer["status"] == "success"
    assert len(answer["response"]) > 0
    assert "fire" in answer["response"].lower()
```

### Running Tests

```powershell
# Run all tests
python -m pytest

# Run specific test file
python -m pytest test_chat_agent.py

# Run with verbose output
python -m pytest -v

# Run with coverage
python -m pytest --cov=backend
```

### Test Categories

- **Unit Tests**: Test individual functions
- **Integration Tests**: Test component interaction
- **API Tests**: Test HTTP endpoints
- **Edge Cases**: Test boundary conditions

## Documentation

### Updating Documentation

When making changes:

1. **Update README.md**
   - If adding features
   - If changing setup process

2. **Update user_manual.md**
   - New user-facing features
   - Usage instructions

3. **Update agents.md**
   - Backend changes
   - API modifications

4. **Add Docstrings**
   - New functions
   - Modified functions

5. **Update CONTRIBUTING.md**
   - Process changes
   - New development guidelines

### Documentation Style

- **Clear**: Use simple, direct language
- **Complete**: Provide examples
- **Consistent**: Match existing style
- **Up-to-date**: Remove outdated info

## Reporting Issues

### Before Reporting

1. **Search existing issues**: Your issue may already be reported
2. **Update software**: Ensure you're using latest version
3. **Reproduce issue**: Verify it's consistent
4. **Gather information**: Collect relevant details

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Start backend with `python backend\server.py`
2. Open http://localhost:8000
3. Type "..."
4. See unexpected behavior

## Expected Behavior
What should happen instead

## Actual Behavior
What actually happens

## Screenshots/Logs
Attach relevant screenshots or console output

## Environment
- OS: Windows 11 / macOS 12 / Ubuntu 22.04
- Python: 3.9.5
- Browser: Chrome 95
- App Version: 1.0.0
```

### Issue Guidelines

- **Use descriptive titles**: "Chat doesn't respond" → "Chat endpoint returns 500 error when message contains emoji"
- **One issue per topic**: Don't combine multiple bugs
- **Provide context**: Include environment details
- **Be civil**: Maintain respectful tone
- **Follow up**: Respond to maintainer questions

## Feature Requests

### Suggesting Features

1. **Check existing requests**: Search closed issues
2. **Create clear description**: Explain value and use case
3. **Provide examples**: Show how feature would work
4. **Discuss implementation**: Suggest technical approach (optional)

### Feature Request Template

```markdown
## Description
What feature would you like?

## Use Case
Why do you need this feature? Who would benefit?

## Proposed Solution
How would this feature work?

## Alternatives Considered
Other solutions or workarounds?

## Additional Context
Examples, mockups, references?
```

## Development Checklist

Before submitting a PR, verify:

- [ ] Feature/fix works locally
- [ ] Code follows style guidelines
- [ ] Commits have clear messages
- [ ] No debug code or console.log() left
- [ ] Documentation updated
- [ ] Tests pass (if applicable)
- [ ] No merge conflicts
- [ ] PR description is complete
- [ ] Related issues referenced
- [ ] Only relevant changes included

## Getting Help

### Resources

- **Questions**: Open a Discussion (if available) or GitHub Issue
- **Chat**: Community Discord (if available)
- **Email**: maintainers@example.com (contact details TBD)

### Common Issues

**Can't connect to backend**
- Ensure backend is running: `python backend\server.py`
- Check port 8001 isn't in use
- See [Troubleshooting](readme.md#troubleshooting)

**Git issues**
- Reset local changes: `git reset --hard origin/main`
- Clear merge conflicts: `git merge --abort`
- Undo recent commit: `git revert HEAD`

**Python issues**
- Recreate venv: Delete `.venv`, run `python -m venv .venv`
- Reinstall packages: `pip install -r requirements.txt`
- Check Python version: `python --version`

## Review Process Timeline

- **Submission**: PR created
- **Initial Review**: Within 2-3 days
- **Feedback/Changes**: Discuss requested changes
- **Approval**: Once all review criteria met
- **Merge**: Maintainer merges to main
- **Release**: Included in next release cycle

## Recognition

Contributors will be:
- Thanked in commit messages
- Added to CONTRIBUTORS.md (coming soon)
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Explorer AI!** 🎉

For questions, contact the maintainers or open an issue on GitHub.
