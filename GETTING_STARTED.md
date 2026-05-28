# LoanTracker Email Activation System - Getting Started

## 🎉 What You Now Have

A fully integrated email activation and profile image upload system for your LoanTracker application:

✅ **Email-Based Authentication** - Users must verify email before login
✅ **Profile Image Upload** - Upload pictures during registration (stored in Cloudinary)
✅ **Activation System** - 24-hour email verification links
✅ **Account Status Tracking** - See activation status on profile page
✅ **Professional Email Template** - Styled HTML emails with activation button
✅ **Cloud Storage** - Images automatically backed up on Cloudinary
✅ **Security Hardening** - Default inactive accounts, verified email access

---

## ⚡ Quick Setup (15 Minutes)

### Step 1: Install Backend Packages

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- `djoser` - Email activation system
- `cloudinary` - Cloud image storage
- `django-cloudinary-storage` - Django integration

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Windows Computer**
5. Copy the 16-character password

### Step 3: Get Cloudinary Credentials

1. Sign up at https://cloudinary.com (free account)
2. Go to Dashboard
3. Copy: **Cloud Name**, **API Key**, **API Secret**

### Step 4: Create .env File

In the `backend` directory, create `.env`:

```env
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
ALLOWED_HOSTS=*

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important:** Replace placeholders with your actual values!

### Step 5: Run Migrations

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### Step 6: Start Backend

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 7: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 8: Test the System

1. Open http://localhost:3000 (frontend may run on 3000 or 5173)
2. Click **Sign up**
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: your-email@gmail.com
   - Password: Test123456
   - Age: 25
   - Birthday: 1999-01-15
   - Address: 123 Main St
   - Profile Picture: Select an image from your computer
4. Click **Sign up**

**Expected:** Message "Registration successful! Check your email to activate your account."

5. Check your email for "Activate your account" from LoanTracker
6. Click the blue "Activate Your Account" button in the email
7. You should see "Your account has been activated successfully!"
8. Click "Go to Login" or go to http://localhost:3000/login
9. Login with:
   - Email: your-email@gmail.com
   - Password: Test123456
10. You're in! See your profile with:
    - Your profile picture
    - Your information
    - Green badge "✓ Activated"

---

## 📁 Project Structure

### Backend Changes

```
backend/
├── requirements.txt (UPDATED - added djoser, cloudinary)
├── config/
│   └── settings.py (UPDATED - Djoser + Cloudinary config)
└── loans/
    ├── models.py (UPDATED - profile_image, is_active)
    ├── serializers.py (UPDATED - image upload support)
    ├── urls.py (UPDATED - Djoser endpoints)
    ├── email.py (NEW - custom activation email)
    ├── templates/ (NEW)
    │   └── activation_email.html (beautiful email template)
    └── migrations/
        └── 0003_activation_system.py (NEW - database changes)
```

### Frontend Changes

```
frontend/src/
├── pages/
│   ├── ActivationPage.tsx (NEW - handles email activation)
│   ├── RegisterPage.tsx (UPDATED - image upload form)
│   ├── LoginPage.tsx (UPDATED - activation messaging)
│   └── ProfilePage.tsx (UPDATED - shows profile image + status)
├── contexts/
│   └── AuthContext.tsx (UPDATED - FormData support)
└── App.tsx (UPDATED - /activate route)
```

---

## 🔄 How It Works

### User Registration

```
1. User fills registration form with profile image
2. Form submitted to /api/auth/users/ as FormData
3. Backend creates inactive user (is_active=False)
4. Image uploaded to Cloudinary
5. Activation email sent to user's email
6. User sees "Check your email" message
```

### Email Activation

```
1. User receives professional HTML email
2. Clicks activation button or link
3. Browser navigates to /activate/{uid}/{token}
4. Frontend sends activation request to backend
5. Backend validates and activates account
6. User redirected to login page
```

### Login

```
1. User enters email + password
2. Backend checks is_active=True
3. If false, shows "Please activate your email" error
4. If true, returns JWT tokens
5. User logged in and redirected to profile
```

### Profile

```
1. User sees profile picture (from Cloudinary)
2. Shows activation status badge
3. Can edit name, age, birthday, address
4. Can logout and login again
```

---

## 📚 Important Documents

### For Detailed Setup: **ACTIVATION_SYSTEM_SETUP.md**

Complete 3000+ word guide covering:
- Email configuration (Gmail)
- Cloudinary setup
- Environment variables
- API endpoints
- Troubleshooting
- Production deployment

### For Quick Reference: **ACTIVATION_QUICK_REFERENCE.md**

Quick reference guide with:
- File structure
- Environment variables
- API endpoints table
- Common issues
- 5-minute quick start

### For Implementation Details: **IMPLEMENTATION_COMPLETE.md**

Technical summary with:
- All changes made
- Security measures
- Testing checklist
- Known limitations
- Future enhancements

---

## ✅ Testing Checklist

Run through this checklist to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can navigate to /register
- [ ] Can upload profile image (preview shows)
- [ ] Form validation works (password length, email format)
- [ ] Registration succeeds and shows success message
- [ ] Check email receives activation email within 30 seconds
- [ ] Activation link is formatted correctly
- [ ] Clicking activation link shows success message
- [ ] Can navigate to /login
- [ ] Cannot login with unactivated account
- [ ] Can login after activation
- [ ] Profile page shows profile picture
- [ ] Profile page shows "✓ Activated" badge
- [ ] Can edit profile information
- [ ] Can logout
- [ ] Can login again with same credentials
- [ ] Image displays from Cloudinary URL

---

## 🚨 Common Issues & Quick Fixes

### "Email not received"

**Solution:**
1. Check spam/junk folder
2. Check your email in .env is correct
3. Verify Gmail app password (not regular password)
4. Enable 2-Step verification in Gmail
5. Test locally: `python manage.py shell` → `from django.core.mail import send_mail` → `send_mail(...)`

### "Image upload fails"

**Solution:**
1. Check Cloudinary credentials in .env
2. Verify image is < 5MB
3. Check image format (PNG, JPG, GIF)
4. View browser console (F12) for error details

### "Can't activate account"

**Solution:**
1. Check activation link has uid and token
2. Links expire after 24 hours
3. Try registering again with new email
4. Check Django logs for error messages

### "Can't login after activation"

**Solution:**
1. Check account is_active in database
2. Verify email matches exactly
3. Check password is correct
4. Look at Django logs for auth errors

For more issues, see **ACTIVATION_SYSTEM_SETUP.md** Troubleshooting section.

---

## 🔐 Security Best Practices

1. **Email Verification** - Accounts inactive until email confirmed
2. **Image Upload** - Only images, max 5MB, stored in cloud
3. **Passwords** - Minimum 8 characters, hashed with bcrypt
4. **Tokens** - JWT with 1-hour expiration, refresh tokens for 7 days
5. **Email** - Gmail app password (not regular password)
6. **CORS** - Configured for localhost development

---

## 🚀 Production Deployment

Before deploying to production:

1. Change `DEBUG=False` in .env
2. Generate new strong `SECRET_KEY`
3. Update `ALLOWED_HOSTS` for your domain
4. Switch to PostgreSQL database
5. Use production email service (SendGrid, AWS SES)
6. Set up HTTPS/SSL certificate
7. Configure CORS for production domain
8. Set environment variables securely (not in code)
9. Enable error logging (Sentry, Datadog)
10. Test activation flow in production

See **ACTIVATION_SYSTEM_SETUP.md** for complete production checklist.

---

## 📖 Next Steps

1. ✅ Complete the 15-minute Quick Setup above
2. ✅ Run the Testing Checklist
3. ✅ Read **ACTIVATION_QUICK_REFERENCE.md** for overview
4. ✅ Read **ACTIVATION_SYSTEM_SETUP.md** for detailed config
5. ✅ Test edge cases (expired links, wrong email, etc.)
6. ✅ Customize email template if needed
7. ✅ Deploy to production following deployment checklist

---

## 📞 Support

- **Email Setup Issues:** https://support.google.com/accounts/answer/185833
- **Cloudinary Help:** https://cloudinary.com/documentation
- **Django Help:** https://docs.djangoproject.com/
- **React Help:** https://react.dev/

---

## 🎯 Success Indicators

You'll know it's working when:

✅ User receives activation email within 30 seconds
✅ Activation link works and activates account
✅ Cannot login before activation
✅ Can login after activation
✅ Profile picture displays on profile page
✅ Profile shows activation status badge
✅ Can edit profile and changes save
✅ Can logout and login again
✅ No errors in Django or React console

---

## 📝 Summary

You now have a production-ready email activation system with:

- **Email-based registration** - Users verify email before accessing
- **Profile image uploads** - Stored securely on Cloudinary
- **Professional emails** - Styled HTML with activation buttons
- **Secure authentication** - JWT tokens with refresh logic
- **User profiles** - Display picture, status, and information
- **Protected routes** - Frontend checks authentication
- **Complete documentation** - Setup guides and API reference

Everything is ready to use! Start with the **Quick Setup** section above.

Good luck! 🚀
