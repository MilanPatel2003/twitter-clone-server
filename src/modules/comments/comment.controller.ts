import { Response } from "express";
import { AuthRequest } from "../../types/api/auth.response";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { CommentResponse } from "../../types/api/comment.response";
import { CommentRow } from "../../types/db/comment.interface";

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const tweetId = req.params.tweetId;
    const { content } = req.body;
    const [row] = await db.query<ResultSetHeader>(
      `INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, NULL)`,
      [userId, tweetId, content],
    );

    res.status(200).json({ message: "comment inserted!", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const replyToComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?.user_id;
    const { content } = req.body;

    const [parentComment] = await db.query<CommentRow[]>(
      `SELECT * FROM comments WHERE comment_id=?`,
      [commentId],
    );

    if (parentComment.length === 0) {
      res.status(400).json({ message: "comment doesnt exist!" });
      return;
    }
    const tweetId = parentComment[0].tweet_id;

    const [row] = await db.query<ResultSetHeader>(
      `INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, ?)`,
      [userId, tweetId, content, commentId],
    );

    res.status(200).json({ message: "comment reply inserted!", commentId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};


export const getCommentsByTweet = async (req: AuthRequest, res: Response) => {
  try {
    const tweetId = req.params.tweetId;

    const [comments] = await db.query<CommentResponse[]>(
      `SELECT c.comment_id, c.content, c.created_at, u.username, u.fullname, u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.tweet_id = ? AND c.parent_comment_id IS NULL;`,
      [tweetId],
    );

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getCommentsReply = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const [commentReplies] = await db.query<CommentResponse[]>(
      `SELECT c.comment_id, c.content, c.created_at, u.username, u.fullname, u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.parent_comment_id = ?`,
      [commentId],
    );

    res.status(200).json(commentReplies);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;

    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM comments WHERE comment_id = ?;`,
      [commentId],
    );

    res
      .status(200)
      .json({ message: "comment deleted successfully!", commentId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
