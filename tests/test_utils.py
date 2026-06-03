"""
Unit tests for Explorer AI backend utilities.
"""

import pytest
from backend.utils import (
    Validator,
    ValidationError,
    Logger,
    RateLimiter
)


class TestValidator:
    """Test cases for input validation."""
    
    def test_validate_message_success(self):
        """Test successful message validation."""
        assert Validator.validate_message("How do I start a fire?") is True
    
    def test_validate_message_empty(self):
        """Test empty message validation."""
        with pytest.raises(ValidationError, match="cannot be empty"):
            Validator.validate_message("")
    
    def test_validate_message_too_long(self):
        """Test message length validation."""
        long_message = "a" * 6000
        with pytest.raises(ValidationError, match="exceeds maximum length"):
            Validator.validate_message(long_message)
    
    def test_validate_message_not_string(self):
        """Test non-string message validation."""
        with pytest.raises(ValidationError, match="must be a string"):
            Validator.validate_message(123)
    
    def test_validate_json_success(self):
        """Test successful JSON validation."""
        result = Validator.validate_json('{"key": "value"}')
        assert result == {"key": "value"}
    
    def test_validate_json_invalid(self):
        """Test invalid JSON validation."""
        with pytest.raises(ValidationError, match="Invalid JSON"):
            Validator.validate_json("{invalid json}")
    
    def test_validate_coordinates_success(self):
        """Test successful coordinate validation."""
        assert Validator.validate_coordinates(40.7128, -74.0060) is True
    
    def test_validate_coordinates_invalid_latitude(self):
        """Test invalid latitude."""
        with pytest.raises(ValidationError, match="Latitude must be between"):
            Validator.validate_coordinates(91, 0)
    
    def test_validate_coordinates_invalid_longitude(self):
        """Test invalid longitude."""
        with pytest.raises(ValidationError, match="Longitude must be between"):
            Validator.validate_coordinates(0, 181)
    
    def test_validate_coordinates_non_numeric(self):
        """Test non-numeric coordinates."""
        with pytest.raises(ValidationError, match="must be numbers"):
            Validator.validate_coordinates("invalid", "coords")


class TestLogger:
    """Test cases for logging functionality."""
    
    def test_logger_singleton(self):
        """Test that Logger is a singleton."""
        logger1 = Logger()
        logger2 = Logger()
        assert logger1 is logger2
    
    def test_logger_methods_exist(self):
        """Test that logger has required methods."""
        logger = Logger()
        assert hasattr(logger, 'info')
        assert hasattr(logger, 'error')
        assert hasattr(logger, 'warning')
        assert hasattr(logger, 'debug')
    
    def test_logger_callable(self):
        """Test that logger methods are callable."""
        logger = Logger()
        # These should not raise exceptions
        logger.info("Test info")
        logger.error("Test error")
        logger.warning("Test warning")
        logger.debug("Test debug")


class TestRateLimiter:
    """Test cases for rate limiting."""
    
    def test_rate_limiter_allows_requests(self):
        """Test that rate limiter allows requests within limit."""
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        
        assert limiter.is_allowed("client1") is True
        assert limiter.is_allowed("client1") is True
        assert limiter.is_allowed("client1") is True
    
    def test_rate_limiter_blocks_excess_requests(self):
        """Test that rate limiter blocks excess requests."""
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        
        assert limiter.is_allowed("client2") is True
        assert limiter.is_allowed("client2") is True
        assert limiter.is_allowed("client2") is False
    
    def test_rate_limiter_independent_clients(self):
        """Test that rate limiter tracks clients independently."""
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        
        assert limiter.is_allowed("client1") is True
        assert limiter.is_allowed("client2") is True
        
        assert limiter.is_allowed("client1") is False
        assert limiter.is_allowed("client2") is False
    
    def test_rate_limiter_remaining_requests(self):
        """Test getting remaining request count."""
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        
        limiter.is_allowed("client3")
        limiter.is_allowed("client3")
        
        remaining = limiter.get_remaining("client3")
        assert remaining == 3
    
    def test_rate_limiter_new_client(self):
        """Test remaining requests for new client."""
        limiter = RateLimiter(max_requests=10, window_seconds=60)
        
        remaining = limiter.get_remaining("new_client")
        assert remaining == 10


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
