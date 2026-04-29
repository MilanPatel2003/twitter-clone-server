import { Response } from "express";
import { AuthRequest } from "../../types/api/auth.response";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";

export const retweetTweet = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.user_id;
    const tweetId = req.params.tweetId;
    const [row] = await db.query<ResultSetHeader>(
      `INSERT IGNORE INTO retweets (user_id, tweet_id) VALUES (?, ?);`,
      [id, tweetId],
    );

    res.status(200).json({ message: "retweet successfull", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};


export const undoRetweet = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.user_id;
    const tweetId = req.params.tweetId;
    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM retweets WHERE user_id = ? AND tweet_id = ?`,
      [id, tweetId],
    );

    res.status(200).json({ message: "retweet deleted", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};