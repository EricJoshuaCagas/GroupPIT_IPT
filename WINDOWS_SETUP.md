# Quick Setup Guide for Windows

## Prerequisites
- Python 3.8 or higher: https://www.python.org/downloads/
- Node.js 14 or higher: https://nodejs.org/
- Git (optional): https://git-scm.com/download/win

## Step-by-Step Setup

### Step 1: Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create admin account (optional but recommended)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
April 19, 2026 - HH:MM:SS
Django version 4.2.7, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
```

✅ Backend is running at: **http://localhost:8000**

### Step 2: Frontend Setup (New Terminal)

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

✅ Frontend is running at: **http://localhost:3000**

## Quick Test

### Test 1: Create an Account
1. Go to http://localhost:3000
2. Click "Create a new account" on login page
3. Fill in your details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test@1234 (min 8 chars)
   - Confirm Password: Test@1234
4. Click "Sign up"
5. You should be redirected to your profile page

### Test 2: Login
1. Logout from the profile page
2. Enter your email: john@example.com
3. Enter your password: Test@1234
4. Click "Sign in"
5. You should see your profile and access to all features

### Test 3: Access Protected Routes
- Click "Borrowers", "Loans", or "Payments" in the navbar
- If logged in, you should see the data
- If logged out, you'll be redirected to login page

## Troubleshooting

### Error: "Python not found"
- Ensure Python is installed and added to PATH
- Test: `python --version`

### Error: "Cannot find module 'rest_framework'"
- Make sure you ran `pip install -r requirements.txt`

### Error: "Port 8000 already in use"
```powershell
# Use a different port
python manage.py runserver 8001
```

### Error: "Port 3000 already in use"
```powershell
# Use a different port
npm run dev -- --port 3001
```

### Error: "CORS error" in browser console
- Ensure both backend and frontend are running
- Check that API_BASE_URL in frontend matches your backend URL

## Database Reset (If Needed)

To start fresh:

```powershell
# Delete the database file
cd backend
del db.sqlite3

# Recreate database
python manage.py migrate

# Create new admin account
python manage.py createsuperuser

# Restart the server
python manage.py runserver
```

## Admin Panel

1. Create a superuser:
   ```powershell
   python manage.py createsuperuser
   ```
2. Visit: http://localhost:8000/admin
3. Login with the superuser credentials
4. Manage users, borrowers, loans, and payments

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/register/ | No | Register new user |
| POST | /api/auth/login/ | No | Login (get tokens) |
| POST | /api/auth/refresh/ | No | Refresh access token |
| GET | /api/auth/profile/ | Yes | Get user profile |
| PATCH | /api/auth/profile/update/ | Yes | Update profile |
| GET | /api/borrowers/ | Yes | List all borrowers |
| POST | /api/loans/ | Yes | Create new loan |
| GET | /api/payments/ | Yes | List all payments |

## Next Steps

1. ✅ Create your first user account
2. ✅ Add borrower information
3. ✅ Create loan records
4. ✅ Record payments
5. ✅ View reports on the dashboard
6. ✅ Edit your profile as needed

## Common Issues & Solutions

### Issue: Page refreshes and goes to login
**Cause**: Token expired or localStorage cleared
**Solution**: Login again. Tokens refresh automatically after login.

### Issue: Can't see registered users
**Cause**: Need to check database
**Solution**: Visit http://localhost:8000/admin to view all users

### Issue: Password too weak error
**Cause**: Password doesn't meet requirements
**Solution**: Use a password with:
- Minimum 8 characters
- Mix of letters and numbers
- At least one special character

## Performance Tips

- Keep both servers running simultaneously
- Use incognito mode to test logout functionality
- Check browser DevTools Console for API errors
- Use Django admin for data management

## Need More Help?

Refer to **AUTHENTICATION_GUIDE.md** for detailed documentation.

---

**Last Updated**: April 19, 2026
