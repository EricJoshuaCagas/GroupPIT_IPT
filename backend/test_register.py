import os
import django
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from loans.serializers import CustomUserCreateSerializer
from loans.models import User

# Test data with unique email
timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
data = {
    'email': f'test_{timestamp}@example.com',
    'first_name': 'Test',
    'last_name': 'User',
    'password': 'TestPass123!',
    're_password': 'TestPass123!'
}

serializer = CustomUserCreateSerializer(data=data)
if serializer.is_valid():
    print('✓ Valid!')
    user = serializer.save()
    print(f'✓ Created user: {user.email} with username: {user.username}')
else:
    print('✗ Errors:', serializer.errors)
