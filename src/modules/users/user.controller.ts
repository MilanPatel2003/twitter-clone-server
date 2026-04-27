import { Request, Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { AuthenticateRequest, Tweet, User } from "../../types/interfaces";

export const uploadProfile = async (
  req: AuthenticateRequest,
  res: Response,
) => {
  try {
    const imageUrl = req.file?.path;
    const id = req.user?.user_id;

    if (!imageUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET profile_image=? WHERE user_id=?`,
      [imageUrl, id],
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", id: id, url: imageUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const test = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "test" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const [row] = await db.query<User[]>(
      `SELECT * FROM users where username=?`,
      [username],
    );
    res.status(200).json(row[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserTweets = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const [row] = await db.query<User[]>(
      `SELECT * FROM users where username=?`,
      [username],
    );
    const userId = row[0].user_id
     const [result] = await db.query<Tweet[]>(
      `SELECT * FROM tweets where user_id=?`,
      [userId],
    );

    res.status(200).json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
