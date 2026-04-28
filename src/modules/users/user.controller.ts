import { Request, Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { AuthenticateRequest, Tweet, User } from "../../types/interfaces";

export const uploadProfile = async (
  req: AuthenticateRequest,
  res: Response,
) => {
  try {
    console.log(req.file);
    
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
    const userId = row[0].user_id;
    const [result] = await db.query<Tweet[]>(
      `SELECT T.tweet_id, T.content, T.created_at, M.media_type, M.media_url
FROM tweets T JOIN tweet_media M
ON T.tweet_id=M.tweet_id
WHERE T.user_id=?`,
      [userId],
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserLikes = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    const [users] = await db.query<User[]>(
      `SELECT * FROM users WHERE username = ?`,
      [username],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = users[0].user_id;

    const [likes] = await db.query(
      `
      SELECT 
        t.*, 
        u.username,
        u.fullname,
        u.profile_image
      FROM reactions r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId],
    );

    res.status(200).json(likes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
