import { Request, Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { compareHash, generateHash } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthRequest, JWTPayload } from "../../types/api/auth.response";
import { UserRow } from "../../types/db/user.interface";
import bcrypt from "bcrypt";

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
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        fullname:user.fullname,
        profile_image:user.profile_image

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
    res.status(200).json(row[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};





// generate random 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1 — user submits email
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // check if user exists
    const [users] = await db.query<any[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      res.status(404).json({ message: "No account found with this email." });
      return;
    }

    const otp = generateOTP();

    // expires in 2 minutes
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // delete any old OTP for this email
    await db.query(`DELETE FROM password_reset_otp WHERE email = ?`, [email]);

    // save new OTP
    await db.query<ResultSetHeader>(
      `INSERT INTO password_reset_otp (email, otp, expires_at) VALUES (?, ?, ?)`,
      [email, otp, expiresAt]
    );

    res.status(200).json({ message: "OTP generated!", otp });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    
    const { email, otp, newPassword } = req.body;

    // find OTP record
    const [rows] = await db.query<any[]>(
      `SELECT * FROM password_reset_otp WHERE email = ? AND otp = ?`,
      [email, otp]
    );

    if (rows.length === 0) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    const record = rows[0];

    // check if OTP expired
    if (new Date() > new Date(record.expires_at)) {
      await db.query(`DELETE FROM password_reset_otp WHERE email = ?`, [email]);
      res.status(400).json({ message: "OTP has expired. Please try again." });
      return;
    }

    // get current user
    const [users] = await db.query<any[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    const user = users[0];

    // check if new password is same as old
    const isSamePassword = await compareHash(newPassword, user.hashed_password);
    if (isSamePassword) {
      res.status(400).json({ message: "New password cannot be same as old password." });
      return;
    }

    // hash new password
    const hashedPassword = await generateHash(newPassword)

    // update password
    await db.query(
      `UPDATE users SET hashed_password = ? WHERE email = ?`,
      [hashedPassword, email]
    );

    // delete OTP record
    await db.query(`DELETE FROM password_reset_otp WHERE email = ?`, [email]);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};