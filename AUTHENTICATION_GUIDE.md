# LoanTracker Authentication System Documentation

## Overview

This document describes the secure authentication and authorization system integrated into the LoanTracker Web Application.

## Features

✅ **User Authentication**
- Email and password-based login
- Secure password hashing with bcrypt
- JWT (JSON Web Token) based session management
- Automatic token refresh

✅ **User Registration**
- Email-based registration
- Password validation
- User profile with extended information:
  - Full Name (First & Last)
  - Email (unique)
  - Age
  - Birthday
  - Address

✅ **Authorization & Access Control**
- Protected routes that require authentication
- Middleware-based request authentication
- Automatic redirection to login for unauthenticated users
- Session timeout with automatic token refresh

✅ **Profile Management**
- View and edit user profile
- Update personal information
- Secure logout functionality

## Architecture

### Backend (Django)

#### Models
- **User**: Custom user model extending Django's AbstractUser
  - Email-based authentication
  - Additional fields: age, birthday, address
  - Passwords are securely hashed using Django's built-in password hashing

- **Borrower**: Enhanced with optional user reference
  - Links borrower profiles to user accounts
  - Maintains backward compatibility with existing data

#### Authentication Endpoints
```
POST   /api/register/                    - User registration
POST   /api/auth/login/                  - Login (returns access & refresh tokens)
POST   /api/auth/refresh/                - Refresh access token
GET    /api/auth/profile/                - Get current user profile (protected)
PATCH  /api/auth/profile/update/         - Update user profile (protected)
POST   /api/auth/logout/                 - Logout notification (optional)
```

#### Security Features
- JWT tokens with 1-hour access lifetime
- 7-day refresh token lifetime
- Automatic token rotation
- Password validation rules
- Unique email constraint
- CORS protection for frontend interaction

### Frontend (React)

#### Components
- **AuthContext**: Global authentication state management
  - User state
  - Token management
  - Login/Register/Logout functions
  - Authentication status

- **ProtectedRoute**: Route wrapper for authenticated pages
  - Automatically redirects to login if unauthenticated
  - Shows loading state while checking authentication

- **Login Page**: User login form
  - Email and password validation
  - Error handling and user feedback
  - Link to registration page

- **Register Page**: User registration form
  - Full user onboarding
  - Password strength validation
  - Duplicate email prevention
  - Auto-login after successful registration

- **Profile Page**: User profile management
  - View all profile information
  - Edit profile details
  - Logout button
  - Quick links to other sections

### API Integration
- Automatic JWT token injection in request headers
- Interceptor for handling 401 responses
- Automatic token refresh with retry logic
- Clear error handling and user notification

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- Node.js 14+
- pip and npm

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**Important**: The migration includes:
- Creation of new User model
- Addition of age, birthday, and address fields to Borrower
- User reference in Borrower model

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the application at: **http://localhost:3000**

## Usage Flow

### For New Users

1. **Visit the Application**
   - Go to http://localhost:3000
   - You'll be redirected to the login page (unauthenticated)

2. **Create Account**
   - Click "Sign up here" on the login page
   - Fill in your details:
     - First Name
     - Last Name
     - Email
     - Password (minimum 8 characters)
     - Optional: Age, Birthday, Address
   - Click "Sign up"

3. **Automatic Login**
   - After successful registration, you're automatically logged in
   - Redirected to your Profile page

### For Existing Users

1. **Login**
   - Click on the email/password fields
   - Enter your credentials
   - Click "Sign in"

2. **Access Application**
   - After authentication, you have access to:
     - Dashboard
     - Borrowers
     - Loans
     - Payments
     - Profile

3. **Logout**
   - Click on your name in the top-right corner (navbar)
   - Select "Logout"
   - Redirected to login page

## Security Best Practices

### Implemented
✅ Passwords are hashed using Django's password hashing
✅ JWT tokens with expiration
✅ CORS protection
✅ Secure token storage in browser localStorage
✅ Input validation (email format, password strength)
✅ Unique email constraint
✅ HTTPS ready configuration

### Recommendations for Production
- Enable HTTPS/SSL
- Use environment variables for SECRET_KEY and database credentials
- Set DEBUG=False in production
- Configure secure CORS origins
- Implement rate limiting on authentication endpoints
- Add two-factor authentication (optional)
- Regular security audits and penetration testing

## Troubleshooting

### Issue: "Email already in use" error
**Solution**: Use a different email or reset the database

### Issue: Login fails with "Invalid credentials"
**Solution**: 
- Verify email and password are correct
- Ensure user account was created during registration
- Check if account is active in Django admin

### Issue: Protected routes redirect to login when already logged in
**Solution**:
- Check if access token exists in localStorage
- Clear browser cache and localStorage
- Logout and login again

### Issue: CORS errors
**Solution**:
- Ensure frontend URL is in CORS_ALLOWED_ORIGINS in Django settings
- Check that API_BASE_URL in frontend matches backend URL

### Issue: Token refresh fails
**Solution**:
- Clear localStorage (`localStorage.clear()` in console)
- Logout and login again
- Check refresh token expiration (default 7 days)

## API Response Examples

### Successful Login
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### User Profile
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "age": 28,
  "birthday": "1995-05-15",
  "address": "123 Main St, City, State ZIP"
}
```

### Error Response
```json
{
  "detail": "Invalid credentials"
}
```

## Testing Authentication

### Using cURL

**Register**
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "securepass123",
    "password2": "securepass123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

**Get Profile** (with token)
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Schema

### User Table
- id (PK)
- email (unique)
- username (unique)
- password (hashed)
- first_name
- last_name
- age
- birthday
- address
- is_active
- is_staff
- is_superuser
- date_joined

### Borrower Table (Updated)
- id (PK)
- user (FK to User, optional)
- full_name
- contact_number
- email (unique)
- address
- age
- birthday
- created_at

## File Structure

```
LoanTracker/
├── backend/
│   ├── loans/
│   │   ├── models.py (updated with User)
│   │   ├── views.py (added auth views)
│   │   ├── serializers.py (added auth serializers)
│   │   ├── urls.py (added auth routes)
│   │   └── migrations/
│   │       └── 0002_authentication.py (new)
│   └── config/
│       └── settings.py (updated JWT config)
├── frontend/
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.tsx (new)
│       ├── components/
│       │   ├── ProtectedRoute.tsx (new)
│       │   └── Button.tsx (updated)
│       ├── pages/
│       │   ├── LoginPage.tsx (new)
│       │   ├── RegisterPage.tsx (new)
│       │   └── ProfilePage.tsx (new)
│       ├── services/
│       │   └── api.ts (updated with interceptors)
│       ├── layouts/
│       │   └── Navbar.tsx (updated with auth UI)
│       └── App.tsx (updated with routes)
```

## Future Enhancements

- Social authentication (Google, Facebook, GitHub)
- Two-factor authentication (2FA)
- Password reset functionality
- Email verification
- Role-based access control (RBAC)
- Audit logging
- API key authentication for external integrations
- Single Sign-On (SSO)

## Support & Contact

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in Django console
3. Inspect browser console for frontend errors
4. Check Django admin at http://localhost:8000/admin

---

**Last Updated**: April 19, 2026
**Version**: 1.0
