import { Request, Response } from "express";
import db from "../../config/db";

export const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;

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
      LIMIT 5
      `,
      [searchTerm, searchTerm],
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
      LIMIT ? OFFSET ?
      `,
      [searchTerm, limit, offset],
    );

    res.status(200).json({
      users,
      tweets,
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
