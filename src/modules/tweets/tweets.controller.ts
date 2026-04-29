import { Response } from "express";
import { AuthenticateRequest } from "../../types/interfaces";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import imagekit from "../../config/imagekit";

export const createTweet = async (req: AuthenticateRequest, res: Response) => {
  let conn;

  try {
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
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
    if (conn) await conn.rollback();

    return res.status(500).json({
      message: (err as Error).message,
    });
  } finally {
    if (conn) conn.release();
  }
};
