"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logIn = exports.resendOTP = exports.verifyOTP = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure the mail transporter. We are using node mailer to send emails.
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g. "myemail@gmail.com"
        pass: process.env.EMAIL_PASSWORD // e.g. "some-app-password" {not user password. we need app password}
    },
});
// Utility to generate random 6-digit OTP
const generateOTP = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
// ============== SIGNUP ==============
const signUp = async (req, res) => {
    try {
        //from the body we are getting name, email and password
        const { name, email, password } = req?.body;
        //check if the user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        //check if the user has provided all the required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, Email & Password are required',
                success: false,
            });
        }
        //hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        //create a new user
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            date: new Date()
        });
        // Generate a verification OTP
        const otp = generateOTP();
        newUser.verificationOTP = otp;
        newUser.verificationOTPExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 mins from now
        newUser.isVerified = false;
        // Save the user to the database
        await newUser.save();
        // Send the OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification OTP',
            text: `Your verification OTP is: ${otp}. It will expire in 2 minutes.`
        });
        //send the response to the client
        return res.status(200).json({
            message: 'Registered successfully, verification OTP sent to your email.',
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.signUp = signUp;
// ============== VERIFY OTP ==============
const verifyOTP = async (req, res) => {
    try {
        //from the body we are getting email and otp
        const { email, otp } = req.body;
        //check if the user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        //check if the user has already been verified
        if (user.verificationOTP !== otp ||
            !user.verificationOTPExpiry ||
            new Date() > user.verificationOTPExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
        }
        //update the user's isVerified
        user.isVerified = true;
        user.verificationOTP = null;
        user.verificationOTPExpiry = null;
        await user.save();
        //send the response to the client
        return res.status(200).json({ message: 'Email verified successfully', success: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.verifyOTP = verifyOTP;
// ============== RESEND OTP ==============
const resendOTP = async (req, res) => {
    try {
        // Get the email from the request body
        const { email } = req.body;
        // Check if the user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        // If already verified, no need to resend
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User is already verified',
                success: false
            });
        }
        // Generate a new OTP
        const otp = generateOTP();
        // Update the user's OTP and expiry time
        user.verificationOTP = otp;
        user.verificationOTPExpiry = new Date(Date.now() + 2 * 60 * 1000);
        // Save the user
        await user.save();
        // Send email with the new OTP
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Resend Verification OTP',
            text: `Your new verification OTP is: ${otp}. It will expire in 15 minutes.`
        });
        //send the response to the client
        return res.status(200).json({
            message: 'Verification OTP resent to your email',
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.resendOTP = resendOTP;
// ============== LOGIN ==============
const logIn = async (req, res) => {
    try {
        //from the body we are getting email and password
        const { email, password } = req.body;
        //check if the user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered', success: false });
        }
        // Must be verified
        if (!user.isVerified) {
            return res.status(400).json({
                message: 'Please verify your email first',
                success: false
            });
        }
        //check if the password is correct
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password', success: false });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
        //send the response to the client
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.logIn = logIn;
// ============== FORGOT PASSWORD ==============
const forgotPassword = async (req, res) => {
    try {
        // Get the email from the request body
        const { email } = req.body;
        // Check if the user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        // Generate a reset OTP
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = new Date(Date.now() + 2 * 60 * 1000); // 1 mins
        // Save the user
        await user.save();
        // Send email with the OTP to reset password
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is: ${otp}, valid for 10 minutes.`
        });
        //send the response to the client
        return res.status(200).json({
            message: 'Reset OTP sent to your email',
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.forgotPassword = forgotPassword;
// ============== RESET PASSWORD ==============
const resetPassword = async (req, res) => {
    try {
        // Get the email, OTP and new password from the request body
        const { email, otp, newPassword } = req.body;
        // Check if the user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        // Check OTP and expiry time validity before resetting password
        if (user.resetPasswordOTP !== otp ||
            !user.resetPasswordOTPExpiry ||
            new Date() > user.resetPasswordOTPExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
        }
        // Update password with the new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        // Clear OTP fields after password reset
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpiry = null;
        //  await user.save();
        await user.save().catch((saveError) => {
            console.error('Database Save Error:', saveError);
            return res.status(500).json({ message: 'Failed to update user', success: false });
        });
        return res.status(200).json({ message: 'Password has been reset successfully', success: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false, error });
    }
};
exports.resetPassword = resetPassword;
