import { Response } from "express";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { AuthRequest } from "../../types/api/auth.response";
import imagekit from "../../config/imagekit";
import { TweetResponse } from "../../types/api/tweet.response";
import { TweetRow } from "../../types/db/tweet.interface";

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
    const [insertedTweet] = await db.query<TweetRow[]>(
      `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (
    SELECT COUNT(*) 
    FROM reactions r 
    WHERE r.tweet_id = t.tweet_id
  ) AS like_count,

  (
    SELECT COUNT(*) 
    FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id
  ) AS retweet_count,

  EXISTS (
    SELECT 1 
    FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id 
      AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 
    FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id 
      AND rt2.user_id = ?
  ) AS isRetweeted

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE t.tweet_id = ?;
`,
      [userId, userId, tweetId],
    );
    res.status(201).json({
      message: "Tweet uploaded successfully",
      tweet:insertedTweet[0]
    });
  } catch (err) {
    conn?.rollback();
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getFeedTweets = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUser = req.user?.user_id;
    const query = `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (
    SELECT COUNT(*) 
    FROM reactions r 
    WHERE r.tweet_id = t.tweet_id
  ) AS like_count,

  (
    SELECT COUNT(*) 
    FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id
  ) AS retweet_count,

  EXISTS (
    SELECT 1 
    FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 
    FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ) AS isRetweeted,

  'tweet' AS type

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE t.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

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

  (
    SELECT COUNT(*) 
    FROM reactions r3 
    WHERE r3.tweet_id = t.tweet_id
  ) AS like_count,

  (
    SELECT COUNT(*) 
    FROM retweets rt3 
    WHERE rt3.tweet_id = t.tweet_id
  ) AS retweet_count,

  EXISTS (
    SELECT 1 
    FROM reactions r4 
    WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 
    FROM retweets rt4 
    WHERE rt4.tweet_id = t.tweet_id AND rt4.user_id = ?
  ) AS isRetweeted,

  'retweet' AS type

FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE r.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

ORDER BY created_at DESC;
`;

    const [UserFeed] = await db.query<any>(query, [
      loggedInUser,
      loggedInUser,
      loggedInUser,
      loggedInUser,
      loggedInUser,
      loggedInUser,
    ]);

    res.status(200).json(UserFeed);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getTweetById = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUser = req.user?.user_id;
    const tweetId = req.params.id;
    const query = `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (
    SELECT COUNT(*) 
    FROM reactions r 
    WHERE r.tweet_id = t.tweet_id
  ) AS like_count,

  (
    SELECT COUNT(*) 
    FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id
  ) AS retweet_count,

  EXISTS (
    SELECT 1 
    FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id 
      AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 
    FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id 
      AND rt2.user_id = ?
  ) AS isRetweeted

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id

WHERE t.tweet_id = ?`;

    const [TweetById] = await db.query<TweetResponse[]>(query, [
      loggedInUser,
      loggedInUser,
      tweetId,
    ]);

    res.status(200).json(TweetById[0]);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getTweetsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUser = req.user?.user_id;
    const userId = req.params.userId;
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

  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ) AS isRetweeted,

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

  (SELECT COUNT(*) FROM reactions r3 WHERE r3.tweet_id = t.tweet_id),
  (SELECT COUNT(*) FROM retweets rt3 WHERE rt3.tweet_id = t.tweet_id),

  EXISTS (
    SELECT 1 FROM reactions r4 
    WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
  ),

  EXISTS (
    SELECT 1 FROM retweets rt4 
    WHERE rt4.tweet_id = t.tweet_id AND rt4.user_id = ?
  ),

  'retweet' AS type

FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTweet = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user?.user_id;
    const tweetId = req.params.id;
    const [row] = await db.query<ResultSetHeader>(
      `DELETE FROM tweets WHERE tweet_id = ? AND user_id = ?`,
      [tweetId, id],
    );

    res.status(200).json({ message: "tweet deleted successfully", tweetId });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
