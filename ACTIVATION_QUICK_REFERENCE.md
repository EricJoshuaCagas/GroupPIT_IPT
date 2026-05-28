# LoanTracker Email Activation System - Quick Reference

## What's New

### Email-Based Authentication
- Users must verify their email before they can login
- Activation email sent automatically with styled HTML template
- Activation link valid for 24 hours

### Profile Image Upload
- Users can upload profile pictures during registration
- Images stored on Cloudinary (cloud-based, scalable)
- Profile image displayed on user profile page

### Account Activation Status
- Profile page shows activation badge (✓ Activated or ⏳ Pending)
- Login blocked until account is activated
- Clear feedback when trying to login with inactive account

---

## Quick Start (5 Minutes)

### 1. Configure Backend (.env)

```bash
# Create .env file in backend directory
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Install & Migrate

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

### 4. Test Registration

1. Visit http://localhost:3000/register
2. Fill form with profile image
3. Check email for activation link
4. Click link to activate
5. Login with email and password
6. See profile with image

---

## File Structure

### Backend Files Added/Modified

```
backend/
├── loans/
│   ├── email.py (NEW) - Custom activation email class
│   ├── models.py (MODIFIED) - Added profile_image and is_active
│   ├── serializers.py (MODIFIED) - Added CustomUserCreateSerializer
│   ├── urls.py (MODIFIED) - Added Djoser endpoints
│   ├── templates/
│   │   └── activation_email.html (NEW) - Styled email template
│   └── migrations/
│       └── 0003_activation_system.py (NEW)
├── config/
│   └── settings.py (MODIFIED) - Djoser, Cloudinary, email config
└── requirements.txt (MODIFIED) - Added djoser, cloudinary, django-cloudinary-storage
```

### Frontend Files Added/Modified

```
frontend/src/
├── pages/
│   ├── ActivationPage.tsx (NEW) - Handles email activation
│   ├── RegisterPage.tsx (MODIFIED) - Added image upload
│   ├── LoginPage.tsx (MODIFIED) - Added activation messaging
│   ├── ProfilePage.tsx (MODIFIED) - Added profile image display
│   └── index.ts (MODIFIED) - Export ActivationPage
├── contexts/
│   └── AuthContext.tsx (MODIFIED) - Support FormData for uploads
├── App.tsx (MODIFIED) - Added /activate/:uid/:token route
└── .env.example (NEW) - Configuration template
```

---

## API Endpoints

### New Djoser Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/users/` | Register with image |
| POST | `/api/auth/users/activation/` | Activate account |
| POST | `/api/auth/token/login/` | Login (Djoser) |
| POST | `/api/auth/users/resend_activation/` | Resend activation email |
| POST | `/api/auth/users/set_password/` | Change password |

### Registration

```javascript
// With image upload
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('first_name', 'John');
formData.append('last_name', 'Doe');
formData.append('password', 'secure123');
formData.append('password2', 'secure123');
formData.append('profile_image', imageFile);

fetch('/api/auth/users/', {
  method: 'POST',
  body: formData // NO Content-Type header!
});
```

### Activation

```javascript
fetch('/api/auth/users/activation/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ uid, token })
});
```

---

## Environment Variables

### Email Configuration

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password (from myaccount.google.com/apppasswords)
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

### Cloudinary Configuration

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Get Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select Mail + Windows Computer
5. Copy the 16-character password (no spaces!)

### Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret

---

## User Experience Flow

### Registration (Frontend)

```
/register page
    ↓
User enters: email, password, name, age, birthday, address, profile_image
    ↓
Click "Sign up"
    ↓
FormData sent to /api/auth/users/
    ↓
Backend creates inactive user (is_active=False)
    ↓
Activation email sent to user's email
    ↓
Redirect to /login with success message
```

### Activation (Frontend)

```
User receives email with link:
http://localhost:3000/activate/MQ/abc-123-def
    ↓
ActivationPage component loads with uid and token
    ↓
Component sends POST to /api/auth/users/activation/
    ↓
Backend validates and activates account (is_active=True)
    ↓
Show success message with countdown
    ↓
Auto-redirect to /login after 3 seconds
```

### Login (Frontend)

```
/login page
    ↓
User enters email + password
    ↓
POST to /api/auth/login/ or /api/auth/users/
    ↓
Backend checks is_active=True
    ↓
✓ If active: Return JWT tokens, login successful
✗ If inactive: Return error "Account not activated"
    ↓
If login successful: Redirect to /profile
```

### Profile (Frontend)

```
/profile page (protected route)
    ↓
Display:
  - Profile picture (from profile_image URL)
  - User name, email, age, birthday, address
  - Green badge "✓ Activated"
    ↓
Can edit non-email fields
    ↓
Can logout
```

---

## Validation & Security

### Image Upload Validation

- **Type:** Only image files (PNG, JPG, GIF, etc.)
- **Size:** Max 5MB
- **Storage:** Cloudinary CDN (not local filesystem)

### Password Requirements

- Minimum 8 characters
- Cannot be all numbers
- Checked against common passwords

### Email Verification

- Activation token valid for 24 hours
- Account locked until activation
- Can request new activation email via `/api/auth/users/resend_activation/`

### Token-Based Auth

- JWT with 1-hour expiration
- Refresh tokens for 7 days
- Automatic refresh on 401 response
- Secure token storage in localStorage

---

## Troubleshooting

### Email not received?

1. Check spam folder
2. Verify email in .env is correct
3. Verify app password (not regular Gmail password)
4. Check Gmail has 2-Step Verification enabled
5. Test: `python manage.py shell` → `send_mail(...)`

### Image not uploading?

1. Check Cloudinary credentials
2. Verify image < 5MB
3. Check browser console for errors
4. Verify file is valid image format

### Can't activate account?

1. Check activation link format
2. Verify uid and token in URL
3. Check if already activated
4. Try re-registering if token expired

### Still stuck?

1. Check Django logs: `python manage.py runserver` output
2. Check browser console (F12 → Console tab)
3. Check network requests (F12 → Network tab)
4. Review ACTIVATION_SYSTEM_SETUP.md for detailed steps

---

## What Happens Behind the Scenes

### Registration

```python
# User submits form with profile_image file
# Backend (Djoser):
# 1. Validates email uniqueness
# 2. Validates password strength
# 3. Creates User: is_active=False
# 4. Uploads image to Cloudinary
# 5. Saves Cloudinary URL to profile_image field
# 6. Generates activation token
# 7. Sends activation email with link
# 8. Returns 201 Created
```

### Activation

```python
# User clicks activation link
# Frontend sends uid + token to /api/auth/users/activation/
# Backend (Djoser):
# 1. Validates token
# 2. Checks if not expired (24 hours)
# 3. Sets is_active=True
# 4. Returns 204 No Content
```

### Login

```python
# User submits email + password to /api/auth/login/
# Backend (Djoser/JWT):
# 1. Finds user by email
# 2. Verifies password
# 3. Checks is_active=True (if not, rejects)
# 4. Generates JWT tokens
# 5. Returns tokens + user data
```

---

## Next Steps

1. ✅ Read ACTIVATION_SYSTEM_SETUP.md for detailed configuration
2. ✅ Set up Gmail app password
3. ✅ Set up Cloudinary account
4. ✅ Configure .env file
5. ✅ Run migrations
6. ✅ Test registration → activation → login flow
7. ✅ Deploy to production (update settings!)

---

## Support Resources

- [Djoser Docs](https://djoser.readthedocs.io/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

Good luck! 🚀
