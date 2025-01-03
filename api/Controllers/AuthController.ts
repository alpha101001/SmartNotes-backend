
import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

// interface SignUpRequest extends Request {
//    body: { name: string; email: string; password: string };
//  }

//  interface OTPVerificationRequest extends Request {
//    body: { email: string; otp: string };
//  }

//  interface LogInRequest extends Request {
//    body: { email: string; password: string };
//  }

//  interface ResetPasswordRequest extends Request {
//    body: { email: string; otp: string; newPassword: string };
//  }
//  interface ForgotPasswordRequest extends Request {
//    body: { email: string };
//  }
//  interface ResendOTPRequest extends Request {
//    body: { email: string };
//  }
//  interface expressResponse extends Response {
//    status(code: number): this;
//    json(body: any): this;
//  }
interface SignUpBody {
   name: string;
   email: string;
   password: string;
 }
 interface LoginBody {
   email: string;
   password: string;
 }
// Configure the mail transporter. We are using node mailer to send emails.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // e.g. "myemail@gmail.com"
    pass: process.env.EMAIL_PASSWORD     // e.g. "some-app-password" {not user password. we need app password}
  },
});

// Utility to generate random 6-digit OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// ============== SIGNUP ==============
const signUp = async (req:Request<{}, {}, SignUpBody>, res: Response) => {
  try {
   //from the body we are getting name, email and password
    const { name, email, password } = req?.body;
      //check if the user already exists
    const existingUser = await UserModel.findOne({ email });
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
    const hashedPassword = await bcrypt.hash(password, 10);
      //create a new user
    const newUser = new UserModel({
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};

interface VerifyOTPBody {
   email: string;
   otp: string;
   }
// ============== VERIFY OTP ==============
const verifyOTP = async (req:  Request<{}, {}, VerifyOTPBody>, res:Response) => {
  try {
   //from the body we are getting email and otp
    const { email, otp } = req.body;
      //check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found', success: false });
    }
      //check if the user has already been verified
    if (
      user.verificationOTP !== otp ||
      !user.verificationOTPExpiry ||
      new Date() > user.verificationOTPExpiry
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
    }
      //update the user's isVerified
    user.isVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpiry = null;
    await user.save();
      //send the response to the client
    return res.status(200).json({ message: 'Email verified successfully', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};

interface ResendOTPBody {
   email: string;
   }

// ============== RESEND OTP ==============
const resendOTP = async (req:  Request<{}, {}, ResendOTPBody>, res: Response) => {
  try {
    // Get the email from the request body
    const { email } = req.body;
      // Check if the user exists
    const user = await UserModel.findOne({ email });
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};

// ============== LOGIN ==============
const logIn = async (req:  Request<{}, {}, LoginBody>,res: Response) => {
  try {
   //from the body we are getting email and password
    const { email, password } = req.body;
      //check if the user exists
    const user = await UserModel.findOne({ email });
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password', success: false });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET

    );
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};

interface ForgotPasswordBody {
   email: string;
   }

// ============== FORGOT PASSWORD ==============
const forgotPassword = async (req:  Request<{}, {}, ForgotPasswordBody>, res: Response) => {
  try {
    // Get the email from the request body
    const { email } = req.body;
      // Check if the user exists
    const user = await UserModel.findOne({ email });
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};

interface ResetPasswordBody {
   email: string;
   otp: string;
   newPassword: string;
   }
// ============== RESET PASSWORD ==============
const resetPassword = async (req:  Request<{}, {}, ResetPasswordBody>, res: Response) => {
  try {
      // Get the email, OTP and new password from the request body
    const { email, otp, newPassword } = req.body;
      // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found', success: false });
    }

    // Check OTP and expiry time validity before resetting password
    if (
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordOTPExpiry ||
      new Date() > user.resetPasswordOTPExpiry
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
    }

    // Update password with the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', success: false, error });
  }
};
   // Export the functions
export { signUp, verifyOTP, resendOTP, logIn, forgotPassword, resetPassword };
