import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongo_url = process.env.MONGO_CONN2;
if (!mongo_url) {
   throw new Error('MongoDB connection string is missing in environment variables.');
}
mongoose.connect(mongo_url!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });
