import { Response } from "express";
import { AuthenticateRequest } from "../../types/interfaces";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";

export const createTweet = async (req: AuthenticateRequest, res: Response) => {
  let conn;
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const content = req.body.content?.trim() || "";
    const file = req.file as any | undefined;
    conn = await db.getConnection();

    await conn.beginTransaction();
    const [tweetResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO tweets (user_id,content) VALUES (?,?)`,
      [userId, content],
    );
    const tweetId = tweetResult.insertId;

    if (file) {
      const url = file.path;
      const mediaType = (file.mimetype || "").startsWith("video")
        ? "video"
        : "image";
      await conn.query(
        "INSERT INTO tweet_media (tweet_id, media_type, media_url) VALUES (?, ?, ?)",
        [tweetId, mediaType, url],
      );
    }
    conn.commit();
    res
      .status(201)
      .json({ message: "Tweet created successfully!", tweetId: tweetId });
  } catch (err) {
    conn?.rollback();
    res.status(500).json({ message: (err as Error).message });
  }
};
