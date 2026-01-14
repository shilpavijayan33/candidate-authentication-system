# Candidate Onboarding & Authentication System

A NestJS backend API for onboarding candidates with email OTP verification, password setup, and JWT authentication.  
Uses PostgreSQL for persistence and Redis for OTP storage.

---

##  Tech Stack

- NestJS + TypeScript  
- PostgreSQL (via TypeORM)  
- Redis (OTP cache)  
- JWT Authentication  
- bcrypt (password hashing)  
- dotenv (`@nestjs/config` for environment variables)

---

##  Features

1. Admin creates candidate
   - POST `/admin/candidates`
   - Fields: `name`, `email`
   - Candidate starts without password
   
2. Send OTP for email verification
   - POST `/auth/send-otp`
   - Input: `email`
   - OTP stored in Redis (expires in 5 minutes)
   
3. Verify OTP
   - POST `/auth/verify-otp`
   - Input: `email`, `otp`
   - On success: candidate marked as `isOtpVerified = true`
   
4. Set password
   - POST `/auth/set-password`
   - Input: `email`, `password`, `confirmPassword`
   - Password hashed with bcrypt
   - Only allowed after OTP verification
   
5. Login
   - POST `/auth/login`
   - Input: `email`, `password`
   - Returns JWT token
   
6. Protected profile API
   - GET `/profile`
   - Requires Bearer JWT token
   - Returns candidate profile

---

##  Setup

  - npm run start:dev
