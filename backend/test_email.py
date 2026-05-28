#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print(f'Email Host: {settings.EMAIL_HOST}')
print(f'Email Port: {settings.EMAIL_PORT}')
print(f'Email Use TLS: {settings.EMAIL_USE_TLS}')
print(f'Email Host User: {settings.EMAIL_HOST_USER}')
print(f'Send Activation Email: {settings.DJOSER["SEND_ACTIVATION_EMAIL"]}')
print('\nAttempting to send test email...')

try:
    result = send_mail(
        'Test Email from Django LoanTracker',
        'This is a test email from Django. If you received this, email configuration is working!',
        settings.EMAIL_HOST_USER,
        ['eric.cagas04@gmail.com'],
        fail_silently=False,
    )
    print(f'✓ Email sent successfully! Result: {result}')
except Exception as e:
    print(f'✗ Error sending email: {type(e).__name__}: {e}')
