import jwt
from datetime import datetime, timedelta
from django.conf import settings
from functools import wraps
from django.http import JsonResponse
from .models import User

def create_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + settings.JWT_EXPIRATION_DELTA
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(allowed_roles=None):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            
            if not payload:
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            if allowed_roles and payload['role'] not in allowed_roles:
                return JsonResponse({'error': 'Forbidden'}, status=403)
            
            request.user_data = payload
            return view_func(request, *args, **kwargs)
        
        return wrapper
    return decorator
