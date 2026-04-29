import { Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { AuthRequest } from "../../types/api/auth.response";
import imagekit from "../../config/imagekit";

export const createTweet = async (req: AuthRequest, res: Response) => {
  let conn;
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const content = req.body.content?.trim() || "";
    const file = req.file as any | undefined;

    if (!content && !file) {
      return res.status(400).json({
        message: "Tweet must have content or media",
      });
    }

    conn = await db.getConnection();

    await conn.beginTransaction();
    const [tweetResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO tweets (user_id, content) VALUES (?, ?)`,
      [userId, content],
    );
    const tweetId = tweetResult.insertId;
    let mediaUrl;
    if (file) {
      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "twitter-clone",
      });

      mediaUrl = uploaded.url;

      const mediaType = file.mimetype.startsWith("video") ? "video" : "image";

      await conn.query(
        `INSERT INTO tweet_media (tweet_id, media_type, media_url)
         VALUES (?, ?, ?)`,
        [tweetId, mediaType, mediaUrl],
      );
    }

    await conn.commit();

    res.status(201).json({
      message: "Tweet uploaded successfully",
      tweetId,
      mediaUrl
    });
  } catch (err) {
    conn?.rollback();
    res.status(500).json({ message: (err as Error).message });
  }
};
