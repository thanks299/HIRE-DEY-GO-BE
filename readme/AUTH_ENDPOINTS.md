# Authentication Endpoints Implementation

## Overview
Implemented complete authentication system with JWT tokens, OTP email verification, password reset, and role-based access control.

## Available Endpoints

### 1. **Register User**
- **Endpoint**: `POST /api/v1/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "CANDIDATE" // Optional: CANDIDATE, RECRUITER, ADMIN (default: CANDIDATE)
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please verify your email.",
    "data": {
      "userId": "user_id",
      "email": "john@example.com",
      "role": "CANDIDATE",
      "isVerified": false
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
  ```

### 2. **Login User**
- **Endpoint**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "userId": "user_id",
      "email": "john@example.com",
      "role": "CANDIDATE",
      "isVerified": true
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
  ```

### 3. **Verify Email**
- **Endpoint**: `POST /api/v1/auth/verify-email`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "data": {
      "userId": "user_id",
      "email": "john@example.com",
      "isVerified": true
    }
  }
  ```

### 4. **Refresh Token**
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "tokens": {
      "accessToken": "new_jwt_token",
      "refreshToken": "new_refresh_token"
    }
  }
  ```

### 5. **Forgot Password**
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "If an account exists with this email, a reset link has been sent",
    "resetLink": "http://localhost:3000/reset-password?token=...&email=..."
  }
  ```

### 6. **Reset Password**
- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "token": "reset_token_from_email",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

## Protected Routes Usage

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth Middleware

The `verifyToken` middleware validates JWT tokens and extracts user ID:
```javascript
import { verifyToken, authorize } from "./middlewares/auth.middleware.js";

// Protect a route
app.get("/api/v1/protected-route", verifyToken, controllerFunction);

// Protect a route with role-based access
app.get("/api/v1/recruiter-route", verifyToken, authorize("RECRUITER"), controllerFunction);
```

## Key Features

✅ **Password Hashing**: Uses bcryptjs with 12 salt rounds
✅ **JWT Authentication**: Access tokens (1h) and refresh tokens (7d)
✅ **Email Verification**: OTP-based email verification (10 minutes expiry)
✅ **Password Reset**: Secure token-based password reset (30 minutes expiry)
✅ **Role-Based Access Control**: CANDIDATE, RECRUITER, ADMIN roles
✅ **Security**: Password hashing, OTP expiry, token expiry, secure headers

## Environment Variables

Required environment variables in `.env.development.local`:

```
MONGODB_URI=mongodb://localhost:27017/hire-dey-go
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
OTP_EXPIRES_IN=10m
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

## Testing

Use Postman, REST Client, or curl to test:

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'
```

## Files Created/Modified

- ✅ `src/controllers/auth.controller.js` - Authentication logic
- ✅ `src/routes/auth.route.js` - Auth endpoints
- ✅ `src/middlewares/auth.middleware.js` - JWT verification and authorization
- ✅ `src/app.js` - Added auth routes
- ✅ `src/config/env.js` - Added JWT environment variables
- ✅ `package.json` - Added jsonwebtoken dependency
- ✅ `.env.development.local` - Sample environment configuration
