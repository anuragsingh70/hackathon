"""
Utility functions for the Explorer AI backend.
Provides validation, logging, and error handling utilities.
"""

import json
import logging
from datetime import datetime
from typing import Any, Callable, Dict, Optional
from functools import wraps


class Logger:
    """Centralized logging for the application."""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Logger, cls).__new__(cls)
            cls._instance._initialize_logger()
        return cls._instance
    
    def _initialize_logger(self):
        """Initialize logging configuration."""
        self.logger = logging.getLogger("explorer-ai")
        self.logger.setLevel(logging.DEBUG)
        
        # Create console handler
        handler = logging.StreamHandler()
        handler.setLevel(logging.DEBUG)
        
        # Create formatter
        formatter = logging.Formatter(
            '[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s'
        )
        handler.setFormatter(formatter)
        
        self.logger.addHandler(handler)
    
    def info(self, message: str, **kwargs):
        """Log info level message."""
        self.logger.info(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error level message."""
        self.logger.error(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning level message."""
        self.logger.warning(message, extra=kwargs)
    
    def debug(self, message: str, **kwargs):
        """Log debug level message."""
        self.logger.debug(message, extra=kwargs)


class ValidationError(Exception):
    """Custom exception for validation errors."""
    pass


class Validator:
    """Input validation utilities."""
    
    @staticmethod
    def validate_message(message: str, max_length: int = 5000) -> bool:
        """
        Validate user message.
        
        Args:
            message: The message to validate
            max_length: Maximum allowed message length
            
        Returns:
            True if valid
            
        Raises:
            ValidationError: If validation fails
        """
        if not message:
            raise ValidationError("Message cannot be empty")
        
        if not isinstance(message, str):
            raise ValidationError("Message must be a string")
        
        if len(message) > max_length:
            raise ValidationError(f"Message exceeds maximum length of {max_length}")
        
        return True
    
    @staticmethod
    def validate_json(data: str) -> Dict[str, Any]:
        """
        Validate and parse JSON data.
        
        Args:
            data: JSON string to parse
            
        Returns:
            Parsed JSON object
            
        Raises:
            ValidationError: If JSON is invalid
        """
        try:
            return json.loads(data)
        except json.JSONDecodeError as e:
            raise ValidationError(f"Invalid JSON: {str(e)}")
    
    @staticmethod
    def validate_coordinates(lat: float, lon: float) -> bool:
        """
        Validate geographical coordinates.
        
        Args:
            lat: Latitude (-90 to 90)
            lon: Longitude (-180 to 180)
            
        Returns:
            True if valid
            
        Raises:
            ValidationError: If coordinates are invalid
        """
        try:
            lat = float(lat)
            lon = float(lon)
        except (ValueError, TypeError):
            raise ValidationError("Coordinates must be numbers")
        
        if not (-90 <= lat <= 90):
            raise ValidationError("Latitude must be between -90 and 90")
        
        if not (-180 <= lon <= 180):
            raise ValidationError("Longitude must be between -180 and 180")
        
        return True


def log_request(func: Callable) -> Callable:
    """
    Decorator to log HTTP requests.
    
    Args:
        func: The function to decorate
        
    Returns:
        Decorated function
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = Logger()
        logger.info(f"Request received: {func.__name__}")
        try:
            result = func(*args, **kwargs)
            logger.info(f"Request completed: {func.__name__}")
            return result
        except Exception as e:
            logger.error(f"Request failed: {func.__name__} - {str(e)}")
            raise
    return wrapper


def time_operation(func: Callable) -> Callable:
    """
    Decorator to measure operation execution time.
    
    Args:
        func: The function to decorate
        
    Returns:
        Decorated function with timing
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = Logger()
        start_time = datetime.now()
        try:
            result = func(*args, **kwargs)
            elapsed = (datetime.now() - start_time).total_seconds()
            logger.debug(f"{func.__name__} executed in {elapsed:.3f}s")
            return result
        except Exception as e:
            elapsed = (datetime.now() - start_time).total_seconds()
            logger.error(f"{func.__name__} failed after {elapsed:.3f}s: {str(e)}")
            raise
    return wrapper


class RateLimiter:
    """Simple rate limiting utility."""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum requests allowed in window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}
    
    def is_allowed(self, client_id: str) -> bool:
        """
        Check if request is allowed for client.
        
        Args:
            client_id: Client identifier (IP address, user ID, etc.)
            
        Returns:
            True if request is allowed
        """
        now = datetime.now()
        
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        # Remove old requests outside the window
        cutoff = now.timestamp() - self.window_seconds
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > cutoff
        ]
        
        if len(self.requests[client_id]) < self.max_requests:
            self.requests[client_id].append(now.timestamp())
            return True
        
        return False
    
    def get_remaining(self, client_id: str) -> int:
        """
        Get remaining requests for client.
        
        Args:
            client_id: Client identifier
            
        Returns:
            Number of remaining requests in current window
        """
        if client_id not in self.requests:
            return self.max_requests
        
        now = datetime.now()
        cutoff = now.timestamp() - self.window_seconds
        valid_requests = len([
            req_time for req_time in self.requests[client_id]
            if req_time > cutoff
        ])
        
        return max(0, self.max_requests - valid_requests)


# Global instances
logger = Logger()
rate_limiter = RateLimiter(max_requests=100, window_seconds=60)
