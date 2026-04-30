import { Request, Response } from "express";
import db from "../../config/db";

export const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const searchTerm = `%${q}%`;

    // USERS
    const [users] = await db.query(
      `
      SELECT user_id, username, fullname, profile_image
      FROM users
      WHERE username LIKE ? OR fullname LIKE ?
      LIMIT 10
      `,
      [searchTerm, searchTerm]
    );

    // TWEETS
    const [tweets] = await db.query(
      `
      SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.username,
        u.fullname,
        u.profile_image
      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.content LIKE ?
      ORDER BY t.created_at DESC
      LIMIT 10
      `,
      [searchTerm]
    );

    res.status(200).json({
      users,
      tweets,
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};