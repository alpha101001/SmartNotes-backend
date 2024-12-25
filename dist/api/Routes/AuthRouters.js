"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express';
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../Controllers/AuthController");
const AuthValidation_1 = require("../Middlewares/AuthValidation");
const router = express_1.default.Router();
// Register
router.post('/register', AuthValidation_1.signUpValidation, AuthController_1.signUp);
// Verify Email OTP
router.post('/verify-otp', AuthController_1.verifyOTP);
// Resend OTP
router.post('/resend-otp', AuthController_1.resendOTP);
// Login
router.post('/login', AuthValidation_1.logInValidation, AuthController_1.logIn);
// Forgot Password
router.post('/forgot-password', AuthController_1.forgotPassword);
// Reset Password
router.post('/reset-password', AuthController_1.resetPassword);
exports.default = router;
