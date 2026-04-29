import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import db from "../config/db";
import { AuthRequest, JWTPayload } from "../types/api/auth.response";
import { UserRow } from "../types/db/user.interface";

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers["authorization"];

  if (!token || typeof token != "string") {
    res.status(403).json({ message: "No token provided!" });
    return;
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    const [row] = await db.query<UserRow[]>(
      `SELECT user_id,fullname,username,profile_image FROM users WHERE user_id=?`,
      [decoded.user_id],
    );

    if (row.length === 0) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    req.user = row[0];
    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
