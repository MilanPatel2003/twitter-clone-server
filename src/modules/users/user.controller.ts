import { Request, Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import imagekit from "../../config/imagekit";
import { AuthRequest } from "../../types/api/auth.response";
import { UserRow } from "../../types/db/user.interface";
import { TweetResponse } from "../../types/api/tweet.response";

export const uploadProfile = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file as any;

    const uploaded = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "twitter-clone",
    });

    const imageUrl = uploaded.url;
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
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.user_id;

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET profile_image = NULL WHERE user_id = ?;`,
      [id],
    );

    res
      .status(200)
      .json({ message: "profile_image deleted successfully", id: id });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};


export const updateCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file as any;

    const uploaded = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "twitter-clone",
    });

    const imageUrl = uploaded.url;
    const id = req.user?.user_id;

    if (!imageUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET cover_image = ? WHERE user_id = ?`,
      [imageUrl, id],
    );

    res
      .status(200)
      .json({
        message: "cover_image updated successfully",
        id: id,
        url: imageUrl,
      });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.user_id;

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET cover_image = NULL WHERE user_id = ?;`,
      [id],
    );

    res
      .status(200)
      .json({ message: "cover_image deleted successfully", id: id });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const username = req.params.username;
  const currentUserId = req.user?.user_id;

  const [users] = await db.query(
    `SELECT * FROM users WHERE username = ?`, [username]
  );
  const user = (users as any[])[0];

  // check if current user follows this profile
  const [rows] = await db.query(
    `SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?`,
    [currentUserId, user.user_id]
  );
  const isFollowing = (rows as any[]).length > 0;

  res.status(200).json({ ...user,isFollowing });
};  


export const getUserTweets = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;
    const [row] = await db.query<UserRow[]>(
      `SELECT * FROM users where username=?`,
      [username],
    );

    const loggedInUser = req.user?.user_id;
    const userId = row[0].user_id;
    const query = `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  -- counts
  (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,
  (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id AND parent_comment_id IS NULL) AS comment_count,


  -- flags
  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ) AS isRetweeted,

  -- no retweeted_by
  NULL AS retweeted_by,
  NULL AS retweeted_by_fullname,
  NULL AS retweeted_by_profile,

  'tweet' AS type

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE t.user_id = ?

UNION ALL

SELECT 
  t.tweet_id,
  t.content,
  r.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  -- counts
  (SELECT COUNT(*) FROM reactions r3 WHERE r3.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt3 WHERE rt3.tweet_id = t.tweet_id) AS retweet_count,
  (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id AND parent_comment_id IS NULL) AS comment_count,


  -- flags
  EXISTS (
    SELECT 1 FROM reactions r4 
    WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt4 
    WHERE rt4.tweet_id = t.tweet_id AND rt4.user_id = ?
  ) AS isRetweeted,

  -- ✅ retweeted by user
  ru.username AS retweeted_by,
  ru.fullname AS retweeted_by_fullname,
  ru.profile_image AS retweeted_by_profile,

  'retweet' AS type

FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
JOIN users ru ON r.user_id = ru.user_id   
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE r.user_id = ?

ORDER BY created_at DESC;`;
    const [result] = await db.query<TweetResponse[]>(query, [
      loggedInUser,
      loggedInUser,
      userId,
      loggedInUser,
      loggedInUser,
      userId,
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserLikes = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;

    const [users] = await db.query<TweetResponse[]>(
      `SELECT * FROM users WHERE username = ?`,
      [username],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const loggedInUser = req.user?.user_id;
    const userId = users[0].user_id;
    const query = `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,
  (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id AND parent_comment_id IS NULL) AS comment_count,


  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ) AS isRetweeted

FROM reactions r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE r.user_id = ?
ORDER BY r.created_at DESC`;

    const [UserlikedTweets] = await db.query(query, [
      loggedInUser,
      userId,
      userId,
      loggedInUser,
      loggedInUser,
      userId,
    ]);

    res.status(200).json(UserlikedTweets);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserReplies = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;
    const loggedInUserId = req.user?.user_id

    const [users] = await db.query<UserRow[]>(
      `SELECT * FROM users WHERE username = ?`,
      [username],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = users[0].user_id;
    const query = `SELECT 
  c.comment_id,
  c.content,
  c.created_at,
  t.tweet_id,
  t.content AS tweet_content,
  u.username,
  u.fullname,
  u.profile_image,
    (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,

  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ) AS isRetweeted
FROM comments c
JOIN tweets t ON c.tweet_id = t.tweet_id
JOIN users u ON c.user_id = u.user_id
WHERE c.user_id = ?
ORDER BY c.created_at DESC;`;

    const [UserReplies] = await db.query<any>(query, [loggedInUserId,loggedInUserId,userId]);

    res.status(200).json(UserReplies);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const {fullname,bio} = req.body
    const id = req.user?.user_id;

    const [row] = await db.query<ResultSetHeader>(
      `UPDATE users SET fullname = ?, bio = ? WHERE user_id = ?`,
      [ fullname, bio, id],
    );

    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        id: id,
      });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};