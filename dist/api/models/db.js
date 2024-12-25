"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongo_url = process.env.MONGO_CONN2;
if (!mongo_url) {
    throw new Error('MongoDB connection string is missing in environment variables.');
}
mongoose_1.default.connect(mongo_url)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});
