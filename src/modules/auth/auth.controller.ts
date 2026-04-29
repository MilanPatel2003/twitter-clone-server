import { Request, Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { compareHash, generateHash } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthRequest, JWTPayload } from "../../types/api/auth.response";
import { UserRow } from "../../types/db/user.interface";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, username, email, password } = req.body;
    const hashedPassword = await generateHash(password);
    const query = `INSERT INTO users (fullname,username,email,hashed_password) VALUES (?,?,?,?)`;

    const [row] = await db.query<ResultSetHeader>(query, [
      fullname,
      username,
      email,
      hashedPassword,
    ]);
    res
      .status(200)
      .json({ message: "Account created successfully!", id: row.insertId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {

  try {
    const { usernameORemail, password } = req.body;

    const [rows] = await db.query<UserRow[]>(
      `SELECT * FROM users WHERE username=? OR email=?`,
      [usernameORemail, usernameORemail],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    const user = rows[0];

    const isMatch = await compareHash(password, user.hashed_password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials!",
      });
    }
    const payload: JWTPayload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    };

    const jwtToken = jwt.sign(payload, env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: Number(env.JWT_EXPIRY),
    });

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db.query<UserRow[]>(
      `SELECT * FROM users WHERE user_id=?`,
      [req.user?.user_id],
    );
    res.status(200).json({ data: row[0] });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
