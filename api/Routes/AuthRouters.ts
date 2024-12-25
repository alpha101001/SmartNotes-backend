import { Request, Response } from 'express';
import routers from 'express';
import { signUp, verifyOTP, resendOTP, logIn, forgotPassword, resetPassword } from '../Controllers/AuthController.ts';
import { signUpValidation, logInValidation } from '../Middlewares/AuthValidation.ts';
const router = routers.Router();

// Register
router.post('/register', signUpValidation, signUp);

// Verify Email OTP
router.post('/verify-otp', verifyOTP);

// Resend OTP
router.post('/resend-otp', resendOTP);

// Login
router.post('/login', logInValidation, logIn);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

export default router;
