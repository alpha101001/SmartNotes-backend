import Joi from 'joi';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {  NextFunction, Request, Response } from 'express';
dotenv.config();

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
const signUpValidation = (req: Request, res: Response, next: NextFunction)  => {
   // validate the request body
  const schema = Joi.object({
   // name, email, and password are required
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required()
  });
  // validate the request body and return error if any field is invalid
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Bad Request', error });
  }
  // if no error, continue to the next middleware
  next();
};

// validate the login request body
const logInValidation = (req: Request, res: Response, next: NextFunction)  => {
  const schema = Joi.object({
    // email and password are required
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required()
  });
  // validate the request body and return error if any field is invalid
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Bad Request', error });
  }
   // if no error, continue to the next middleware
  next();
};
const authMiddleware = (req: Request, res: Response, next: NextFunction)  => {
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
     const decoded: any = jwt.verify(token, process.env.JWT_SECRET);



     // attach user info to req
     (req as any).user = { _id: decoded._id, email: decoded.email };
     // continue to the next middleware
     next();
   } catch (error) {
     return res.status(401).json({ message: 'Unauthorized', success: false, error });
   }
 };

export { signUpValidation, logInValidation, authMiddleware };
