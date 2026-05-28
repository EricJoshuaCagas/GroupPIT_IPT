import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"\nSending test email...")

try:
    result = send_mail(
        subject='Test Email from LoanTracker Django',
        message='This is a test email to verify Gmail configuration is working.',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['eric.cagas04@gmail.com'],
        fail_silently=False,
    )
    print(f"✓ Email sent successfully! Result: {result}")
except Exception as e:
    print(f"✗ Error: {type(e).__name__}")
    print(f"  Details: {str(e)}")
    import traceback
    traceback.print_exc()
