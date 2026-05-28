# LoanTracker Authentication & Activation System - Setup Guide

This guide walks you through setting up the complete authentication and activation system for LoanTracker with email verification and Cloudinary image uploads.

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Email Configuration (Gmail)](#email-configuration-gmail)
4. [Cloudinary Setup](#cloudinary-setup)
5. [Testing the System](#testing-the-system)
6. [Troubleshooting](#troubleshooting)

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages added:
- `djoser` - Django authentication library with email activation
- `cloudinary` - Cloud storage for images
- `django-cloudinary-storage` - Django integration for Cloudinary

### Step 2: Create .env File

Copy `.env.example` to `.env` in the backend directory:

```bash
cd backend
cp ../.env.example .env
```

Then update the `.env` file with your configuration (see sections below).

### Step 3: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

This creates the User model with:
- `profile_image` field (stored in Cloudinary)
- `is_active` field (defaults to False, requires email activation)

### Step 4: Create Superuser

```bash
python manage.py createsuperuser --email admin@example.com
```

Use your admin email and a strong password.

### Step 5: Verify Settings

Check that `settings.py` has:

```python
INSTALLED_APPS includes: 'djoser', 'cloudinary_storage', 'cloudinary'
```

Djoser configuration (already added):
```python
DJOSER = {
    'LOGIN_FIELD': 'email',
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'activate/{uid}/{token}/',
    ...
}
```

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

No new dependencies needed - the frontend already has all required packages.

### Step 2: Verify Configuration

The `AuthContext` has been updated to support:
- FormData for file uploads
- Djoser registration endpoint (`/api/auth/users/`)
- Email activation flow

### Step 3: Key Frontend Changes

**Components:**
- `RegisterPage.tsx` - Now includes profile image upload
- `ActivationPage.tsx` - New component for email activation
- `LoginPage.tsx` - Enhanced with activation messaging
- `ProfilePage.tsx` - Displays profile image and activation status

**Routes:**
- `/register` - Registration with image upload
- `/activate/:uid/:token` - Email activation
- `/login` - Login with activation check
- `/profile` - Profile display with image

---

## Email Configuration (Gmail)

### Prerequisites

You need a Gmail account with an App Password (not your regular Gmail password).

### Step 1: Enable 2-Step Verification

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your OS)
3. Google will generate a 16-character password
4. Copy this password

### Step 3: Update .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the 16-character password from Step 2 (without spaces)

### Step 4: Test Email Configuration

```bash
python manage.py shell
```

```python
from django.core.mail import send_mail

send_mail(
    'Test Email',
    'This is a test email from LoanTracker.',
    'noreply@loantracker.com',
    ['your-email@gmail.com'],
    fail_silently=False,
)
```

You should receive an email. If not, check:
- Gmail app password is correct (no spaces)
- 2-Step verification is enabled
- `EMAIL_HOST_USER` matches your Gmail account

---

## Cloudinary Setup

### Step 1: Create Cloudinary Account

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Verify your email
3. Go to your Dashboard

### Step 2: Get Your Credentials

In the Dashboard, you'll see:
- **Cloud Name** - Your unique identifier
- **API Key** - Your API key
- **API Secret** - Your API secret

### Step 3: Update .env

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Set Upload Presets (Optional)

For a more secure setup with size limits:

1. Go to Settings → Upload
2. Create an unsigned upload preset
3. Set size restrictions (e.g., max 5MB)

---

## Testing the System

### Full Registration & Activation Flow

#### Step 1: Register a New Account

1. Go to http://localhost:3000/register
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password (minimum 8 characters)
   - Optional: Profile image, age, birthday, address
3. Click "Sign up"

**Expected:** Redirected to login page with success message

#### Step 2: Check Your Email

Check the email address you registered with. You should see an email from "LoanTracker" with:
- Subject: "Activate account"
- Content: "Account Activation Required"
- Action: Blue "Activate Your Account" button

**Troubleshooting:**
- Check spam/junk folder
- Verify email configuration in .env
- Check Django logs for email errors

#### Step 3: Activate Your Account

Click the activation link in the email, or:

1. Copy the activation link from the email
2. Paste it in your browser
3. Wait for confirmation message
4. You'll be redirected to login page

**Expected:** "Your account has been activated successfully!"

#### Step 4: Login

1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click "Sign in"

**Expected:** Redirected to your profile page with:
- Your profile picture (if uploaded)
- Your information displayed
- Green "✓ Activated" badge

### Manual Testing Checklist

- [ ] User can register with profile image
- [ ] Profile image displays on profile page
- [ ] Registration email sent within 30 seconds
- [ ] Activation link in email works
- [ ] Cannot login before activation
- [ ] Can login after activation
- [ ] Profile shows "✓ Activated" badge
- [ ] Can edit profile (except email)
- [ ] Can logout and login again

---

## API Endpoints Reference

### Authentication Endpoints (Djoser)

**Register User**
```
POST /api/auth/users/
Content-Type: multipart/form-data

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123",
  "password2": "securepassword123",
  "age": 25,
  "birthday": "1999-01-15",
  "address": "123 Main St",
  "profile_image": <file>
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  ...
}
```

**Activate Account**
```
POST /api/auth/users/activation/

{
  "uid": "MQ",
  "token": "abc123..."
}

Response: 204 No Content
```

**Login**
```
POST /api/auth/login/

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

---

## Troubleshooting

### Email Not Sending

**Problem:** Activation email not received

**Solutions:**
1. Check .env file for correct credentials
2. Verify Gmail app password (not regular password)
3. Check 2-Step verification is enabled
4. Look for errors in Django logs: `python manage.py runserver` output
5. Try sending a test email (see Email Configuration section)

### Image Upload Not Working

**Problem:** Image upload fails or doesn't appear

**Solutions:**
1. Check Cloudinary credentials in .env
2. Verify file size is under 5MB
3. Ensure file is a valid image (PNG, JPG, GIF)
4. Check browser console for errors
5. Verify CSRF token is being sent

### Activation Link Expired

**Problem:** "Activation link expired or invalid"

**Solutions:**
1. Links expire after 24 hours - request a new registration
2. Check that uid and token are complete in URL
3. Verify user hasn't already been activated

### Cannot Login After Activation

**Problem:** "Your account is not activated" error persists after clicking activation link

**Solutions:**
1. Check database: `User.objects.filter(email='your@email.com').values('is_active')`
2. Manually activate: `User.objects.filter(email='your@email.com').update(is_active=True)`
3. Check Django logs for activation endpoint errors

### Profile Image Not Displaying

**Problem:** Image uploads but doesn't show on profile

**Solutions:**
1. Verify Cloudinary URL is returned in profile response
2. Check CORS headers allow Cloudinary domain
3. Clear browser cache
4. Verify image file permissions in Cloudinary

---

## Security Notes

### Password Requirements

- Minimum 8 characters
- Cannot be entirely numeric
- Checked against common passwords

### Image Upload Security

- Max file size: 5MB
- Only image files allowed
- Stored securely on Cloudinary CDN
- CORS headers prevent unauthorized access

### Email Security

- Activation tokens expire after 24 hours
- Account locked until email confirmed
- Password reset requires email verification

### CSRF & CORS

- CORS configured for localhost:3000
- Update `ALLOWED_HOSTS` in production
- CSRF tokens automatically handled by DRF

---

## Production Deployment Checklist

- [ ] Set `DEBUG=False` in .env
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Use strong `SECRET_KEY`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure production email service (SendGrid, AWS SES, etc.)
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for your production domain
- [ ] Set up error logging and monitoring
- [ ] Review Cloudinary settings for production
- [ ] Test email delivery with real email service

---

## Additional Resources

- [Djoser Documentation](https://djoser.readthedocs.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

For issues or questions, check the Django logs and browser console for detailed error messages.
