import { ResultSetHeader } from "mysql2";
import { AuthRequest } from "../../types/api/auth.response";
import db from "../../config/db";
import { Response } from "express";

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.user_id;
    const followeeId = req.params.userId;
    const [row] = await db.query<ResultSetHeader>(
      `INSERT INTO follows (follower_id, followee_id) VALUES (?, ?);`,
      [followerId, followeeId],
    );

    res.status(200).json({ message: "User followed", followeeId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.user_id;
    const followeeId = req.params.userId;
    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`,
      [followerId, followeeId],
    );

    res.status(200).json({ message: "Unfollowed User", followeeId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const followeeId = req.params.userId;
    const [followers] = await db.query<ResultSetHeader>(
      `SELECT u.user_id, u.username, u.fullname, u.profile_image
FROM follows f
JOIN users u ON f.follower_id = u.user_id
WHERE f.followee_id = ?;`,
      [followeeId],
    );

    res.status(200).json(followers);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};


export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.params.userId;
    const [following] = await db.query<ResultSetHeader>(
      `SELECT u.user_id, u.username, u.fullname, u.profile_image
FROM follows f
JOIN users u ON f.followee_id = u.user_id
WHERE f.follower_id = ?`,
      [followerId],
    );

    res.status(200).json(following);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

