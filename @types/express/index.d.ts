import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email?: string;
      };
      body?: {
         name?: string;
         email?: string;
         password?: string;
         otp?: string;
         newPassword?: string;
       };
    }
    interface Response {
      status?: (code?: number) => Response;
      json?: (body?: any) => Response;
    }
  }
}
