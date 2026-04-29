import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    username: string;
    fullname: string;
    profile_image: string | null;
  };
}

export interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
}
