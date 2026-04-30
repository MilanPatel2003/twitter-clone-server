import { Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { AuthRequest } from "../../types/api/auth.response";

export const likeTweet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const tweetId = req.params.tweetId;
    const [row] = await db.query<ResultSetHeader>(
      `INSERT IGNORE INTO reactions (user_id,tweet_id,isLiked) VALUES (?,?,?)`,
      [userId, tweetId, true],
    );
    res.status(200).json({ message: "tweet liked!", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const unlikeTweet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const tweetId = req.params.tweetId;
    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM reactions WHERE user_id = ? AND tweet_id = ?;`,
      [userId, tweetId],
    );
    res.status(200).json({ message: "tweet unliked!", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};


export const likeComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const comment_id  = req.params.comment_id ;
    const [row] = await db.query<ResultSetHeader>(
      `INSERT IGNORE INTO comment_reactions (user_id, comment_id) VALUES (?, ?)`,
      [userId, comment_id , true],
    );
    res.status(200).json({ message: "comment liked!", comment_id  });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const unlikeComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const comment_id  = req.params.comment_id ;
    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM comment_reactions WHERE user_id = ? AND comment_id = ?`,
      [userId, comment_id ],
    );
    res.status(200).json({ message: "comment unliked!", comment_id  });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
