# Security Guidelines

## Overview

This document outlines security best practices for deploying and maintaining Explorer AI.

## 1. Data Security

### Input Validation

All user inputs must be validated:

```python
from backend.utils import Validator, ValidationError

# Validate messages
try:
    Validator.validate_message(user_message)
except ValidationError as e:
    return error_response(str(e))

# Validate coordinates
try:
    Validator.validate_coordinates(lat, lon)
except ValidationError as e:
    return error_response(str(e))
```

### Sensitive Data

- **Never store** passwords, API keys, or personal information
- **Sanitize** all logs to remove sensitive data
- **Use environment variables** for configuration secrets
- **Encrypt** data in transit (HTTPS/TLS)

### Chat History

- **Local Storage Only**: Chat history is stored locally, not on external servers
- **User Control**: Users can clear history at any time
- **Privacy**: No analytics or tracking of user conversations
- **Expiration**: Consider implementing automatic history cleanup

## 2. API Security

### Authentication

For production deployments, implement:

```python
# Example: API key validation
def validate_api_key(request):
    api_key = request.headers.get('X-API-Key')
    if not api_key or not is_valid_key(api_key):
        raise AuthenticationError("Invalid API key")
    return True
```

### Rate Limiting

The application includes rate limiting to prevent abuse:

```python
from backend.utils import rate_limiter

if not rate_limiter.is_allowed(client_ip):
    return rate_limit_response()
```

### CORS Configuration

Current CORS allows:
- Local development (localhost)
- Vercel deployments

For additional origins, update [api/index.py](api/index.py):

```python
ALLOWED_ORIGINS = [
    'http://localhost:*',
    'https://*.vercel.app',
    'https://your-domain.com'  # Add your domain
]
```

## 3. Deployment Security

### Environment Variables

Never commit sensitive configuration:

```bash
# .env file (add to .gitignore)
API_KEY=your-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### HTTPS/TLS

- **Production**: Always use HTTPS
- **Vercel**: Automatically provides SSL/TLS certificates
- **Self-hosted**: Use Let's Encrypt or similar service

### Headers Security

Implement security headers:

```python
# Add to response headers
def add_security_headers(response):
    response['X-Content-Type-Options'] = 'nosniff'
    response['X-Frame-Options'] = 'DENY'
    response['X-XSS-Protection'] = '1; mode=block'
    response['Strict-Transport-Security'] = 'max-age=31536000'
    return response
```

## 4. Code Security

### Dependencies

- **Regular Updates**: Keep all dependencies up to date
- **Vulnerability Scanning**: Use tools like Snyk or Dependabot
- **Pinned Versions**: Pin dependencies in requirements.txt

```bash
# Check for vulnerable packages
pip install safety
safety check
```

### Error Handling

Never expose sensitive information in error messages:

```python
# ✓ Good
response = {"status": "error", "error": "Invalid request"}

# ✗ Bad - Exposes implementation details
response = {"status": "error", "error": f"Database error: {db_error}"}
```

### Logging

Avoid logging sensitive information:

```python
from backend.utils import logger

# ✓ Good
logger.info(f"User query processed: {query_hash}")

# ✗ Bad - May contain sensitive data
logger.info(f"User query: {full_query}")
```

## 5. Vercel Deployment Security

### Configuration

- **Build Environment**: Uses `buildCommand` from vercel.json
- **Function Exclusions**: Excludes unnecessary files from serverless functions
- **Environment Variables**: Set in Vercel dashboard, not in code

### Best Practices

```json
{
  "functions": {
    "api/index.py": {
      "excludeFiles": "{frontend/**,**/__pycache__/**}"
    }
  },
  "env": [
    {
      "key": "API_KEY",
      "value": "@api-key"
    }
  ]
}
```

## 6. Frontend Security

### XSS Prevention

- **Content Escaping**: Escape all user-generated content
- **CSP Headers**: Implement Content Security Policy
- **DOM Sanitization**: Use textContent instead of innerHTML

```javascript
// ✓ Good - Prevents XSS
element.textContent = userInput;

// ✗ Bad - Vulnerable to XSS
element.innerHTML = userInput;
```

### Storage Security

- **LocalStorage**: Don't store sensitive data
- **Sensitive Cookies**: Use HttpOnly and Secure flags
- **Session Data**: Keep minimal data in client storage

## 7. Network Security

### SSL/TLS

- **Certificate**: Auto-managed by Vercel/hosting provider
- **Protocols**: Use TLS 1.2 or higher
- **Ciphers**: Use strong cipher suites

### DNS

- **DNSSEC**: Enable if available
- **Monitoring**: Monitor for DNS hijacking

## 8. Incident Response

### Security Incident Procedure

1. **Detection**: Monitor logs for suspicious activity
2. **Containment**: Stop the application if necessary
3. **Investigation**: Review logs and identify cause
4. **Remediation**: Fix the vulnerability
5. **Communication**: Notify users if data was affected
6. **Documentation**: Document lessons learned

### Log Monitoring

```python
from backend.utils import logger

# Monitor for suspicious patterns
if failed_requests > threshold:
    logger.warning(f"High failed request rate detected")

if rate_limit_violations > threshold:
    logger.warning(f"Possible attack: rate limit violations")
```

## 9. Regular Security Audits

### Checklist

- [ ] Review access logs monthly
- [ ] Update dependencies quarterly
- [ ] Security audit of code changes
- [ ] Test backup and recovery procedures
- [ ] Update security policy annually
- [ ] Review third-party service access

### Tools

- **OWASP ZAP**: Automated security scanner
- **Bandit**: Python security linter
- **npm audit**: Dependency vulnerability checker

## 10. Compliance

### Data Privacy

- **GDPR**: If serving EU users, comply with data protection regulations
- **CCPA**: If serving California users, comply with privacy laws
- **Privacy Policy**: Maintain and publish privacy policy

### Standards

- **OWASP Top 10**: Follow OWASP security best practices
- **CWE**: Address Common Weakness Enumeration vulnerabilities
- **Industry Standards**: Comply with relevant standards (ISO 27001, etc.)

## Support

For security concerns:
- Email: `security@explorer-ai.com`
- Do not publicly disclose security vulnerabilities
- Allow 30 days for security patch before public disclosure

---

Last Updated: June 2026
