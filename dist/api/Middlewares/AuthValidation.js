"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.logInValidation = exports.signUpValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
// interface expressRequest extends Request {
//    body: { name: string; email: string; password: string };
//    headers: { authorization: string };
//    user?: { _id: string; email: string };
//    }
// interface expressResponse extends Response {
//    status(code: number): this;
//    json(body: any): this;
// }
// validate the sign up request body
const signUpValidation = (req, res, next) => {
    // validate the request body
    const schema = joi_1.default.object({
        // name, email, and password are required
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(4).max(20).required()
    });
    // validate the request body and return error if any field is invalid
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Bad Request', error });
    }
    // if no error, continue to the next middleware
    next();
};
exports.signUpValidation = signUpValidation;
// validate the login request body
const logInValidation = (req, res, next) => {
    const schema = joi_1.default.object({
        // email and password are required
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(4).max(20).required()
    });
    // validate the request body and return error if any field is invalid
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Bad Request', error });
    }
    // if no error, continue to the next middleware
    next();
};
exports.logInValidation = logInValidation;
const authMiddleware = (req, res, next) => {
    try {
        // get the token from the request header
        const tokenHeader = req.headers.authorization;
        // check if the token is provided in the request header
        if (!tokenHeader) {
            return res.status(401).json({ message: 'No token provided', success: false });
        }
        // split the token to get the actual token
        const token = tokenHeader.split(' ')[1];
        // verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // attach user info to req
        req.user = { _id: decoded._id, email: decoded.email };
        // continue to the next middleware
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized', success: false, error });
    }
};
exports.authMiddleware = authMiddleware;
