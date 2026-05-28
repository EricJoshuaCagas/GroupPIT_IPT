import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.tokens import default_token_generator
from loans.models import User

# Get the last registered user
user = User.objects.filter(is_active=False).order_by('-id').first()
if user:
    token = default_token_generator.make_token(user)
    print(f'\nUser: {user.email}')
    print(f'UID: {user.pk}')
    print(f'Token: {token[:50]}...')
    print(f'\nActivation URL:\nhttp://localhost:8000/api/auth/activate/{user.pk}/{token}/')
else:
    print('No inactive users found')
