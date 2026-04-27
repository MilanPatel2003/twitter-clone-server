import { Request } from "express";
import { RowDataPacket } from "mysql2";
export interface User extends RowDataPacket {
  user_id: number;

  fullname: string;
  username: string;
  email: string;

  hashed_password: string;

  dob: Date | null | string;
  bio: string | null;
  country: string | null;

  profile_image: string | null;
  cover_image: string | null;

  created_at: Date;
}

export interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
}

export interface AuthenticateRequest extends Request {
  user?: User;
}

export interface Tweet extends RowDataPacket {
  tweet_id: number;
  user_id: number;
  content: string;
  created_at: Date;
}
