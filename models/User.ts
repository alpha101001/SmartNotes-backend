import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
   // Define the schema for a user
   // name of the user
  name: {
    type: String,
    required: true
  },
   // email of the user
  email: {
    type: String,
    required: true
  },
   // password of the user
  password: {
    type: String,
    required: true
  },
   // createdAt and updatedAt fields to store timestamps
  date: {
    type: Date,
    default: Date.now
  },

  // Verification
  // isVerified is a boolean to determine if the user has verified their email or not
  // verificationOTP is the one-time password sent to the user for email verification
  // verificationOTPExpiry is the expiration time of the verification OTP

  // Email Verification
  // isVerified is a boolean to determine if the user has verified their email or not
  // verificationOTP is the one-time password sent to the user for email verification
  // verificationOTPExpiry is the expiration time of the verification OTP

  // Reset Password
  // resetPasswordOTP is the one-time password sent to the user for password reset
  // resetPasswordOTPExpiry is the expiration time of the reset password OTP
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String,
    default: null
  },
  verificationOTPExpiry: {
    type: Date,
    default: null
  },

  // Reset Password
  resetPasswordOTP: {
    type: String,
    default: null
  },
  resetPasswordOTPExpiry: {
    type: Date,
    default: null
  }
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
