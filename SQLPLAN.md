# Twitter Clone Backend API

A scalable backend for a Twitter/X-like platform built with **Node.js, TypeScript, Express, and MySQL**.

---

# Tech Stack

* Node.js
* TypeScript
* Express.js
* MySQL
* JWT Authentication
* bcrypt
* Zod
* Multer
* ImageKit

---

# API Endpoints & Queries

---

## Auth

```http
POST /api/auth/register        → registerUser
POST /api/auth/login           → loginUser
GET  /api/auth/me              → getCurrentUser
POST /api/auth/logout          → logoutUser
PUT  /api/auth/password        → updatePassword
```

### Queries

```sql
INSERT INTO users (fullname, username, email, password)
VALUES (?, ?, ?, ?);

SELECT * FROM users WHERE email = ?;

SELECT user_id, username, fullname, profile_image
FROM users WHERE user_id = ?;

UPDATE users SET password = ? WHERE user_id = ?;
```

---

## Users

```http
GET    /api/users/:username            → getUserProfile
GET    /api/users/:username/tweets     → getUserTweets
GET    /api/users/:username/replies    → getUserReplies
GET    /api/users/:username/likes      → getUserLikes

PUT    /api/users/profile              → updateUserProfile
PUT    /api/users/profile-image        → updateProfileImage
PUT    /api/users/cover-image          → updateCoverImage

DELETE /api/users/profile-image        → deleteProfileImage
DELETE /api/users/cover-image          → deleteCoverImage
```

### Queries

```sql
-- Profile
SELECT user_id, username, fullname, bio, profile_image, cover_image
FROM users WHERE username = ?;

-- User Tweets + Retweets
SELECT 
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

ORDER BY created_at DESC;

-- User Replies
SELECT 
  c.comment_id,
  c.content,
  c.created_at,
  t.tweet_id,
  t.content AS tweet_content,
  u.username,
  u.fullname,
  u.profile_image
FROM comments c
JOIN tweets t ON c.tweet_id = t.tweet_id
JOIN users u ON c.user_id = u.user_id
WHERE c.user_id = ?
AND c.parent_comment_id IS NOT NULL
ORDER BY c.created_at DESC;

-- User Likes
SELECT 
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
  ) AS isRetweeted

FROM reactions r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE r.user_id = ?
ORDER BY r.created_at DESC;

-- Update Profile
UPDATE users SET fullname = ?, bio = ? WHERE user_id = ?;

-- Profile Image
UPDATE users SET profile_image = ? WHERE user_id = ?;
UPDATE users SET profile_image = NULL WHERE user_id = ?;

-- Cover Image
UPDATE users SET cover_image = ? WHERE user_id = ?;
UPDATE users SET cover_image = NULL WHERE user_id = ?;
```

---

## Tweets

```http
POST   /api/tweets              → createTweet
GET    /api/tweets/feed         → getFeedTweets
GET    /api/tweets/:id          → getTweetById
GET    /api/tweets/user/:userId → getTweetsByUser
DELETE /api/tweets/:id          → deleteTweet
```

### Queries

```sql
-- Create
INSERT INTO tweets (user_id, content) VALUES (?, ?);

-- Delete
DELETE FROM tweets WHERE tweet_id = ? AND user_id = ?;
```

### Feed

```sql
SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  EXISTS (
    SELECT 1 FROM reactions r 
    WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id AND rt.user_id = ?
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

  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ),

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ),

  'retweet'

FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE r.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

ORDER BY created_at DESC;
```

---

## Tweet By ID

```sql
SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (SELECT COUNT(*) FROM reactions WHERE tweet_id = t.tweet_id) AS like_count,

  EXISTS (
    SELECT 1 FROM reactions r 
    WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id AND rt.user_id = ?
  ) AS isRetweeted

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.tweet_id = ?;
```

---

## Retweets

```http
POST   /api/retweets/:tweetId → retweetTweet
DELETE /api/retweets/:tweetId → undoRetweet
```

```sql
INSERT IGNORE INTO retweets (user_id, tweet_id) VALUES (?, ?);

DELETE FROM retweets WHERE user_id = ? AND tweet_id = ?;
```

---

## Follows

```http
POST   /api/follows/:userId           → followUser
DELETE /api/follows/:userId           → unfollowUser
GET    /api/follows/:userId/followers → getFollowers
GET    /api/follows/:userId/following → getFollowing
```

```sql
INSERT INTO follows (follower_id, followee_id) VALUES (?, ?);

DELETE FROM follows WHERE follower_id = ? AND followee_id = ?;

SELECT u.user_id, u.username, u.fullname, u.profile_image
FROM follows f
JOIN users u ON f.follower_id = u.user_id
WHERE f.followee_id = ?;

SELECT u.user_id, u.username, u.fullname, u.profile_image
FROM follows f
JOIN users u ON f.followee_id = u.user_id
WHERE f.follower_id = ?;
```

---

## Comments

```http
POST   /api/comments/:tweetId         → createComment
POST   /api/comments/reply/:commentId → replyToComment
GET    /api/comments/tweet/:tweetId   → getCommentsByTweet
GET    /api/comments/reply/:commentId → getCommentsReply
DELETE /api/comments/:id              → deleteComment
```

```sql
INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, NULL);

INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, ?);

SELECT c.comment_id, c.content, c.created_at, u.username, u.fullname, u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.tweet_id = ? AND c.parent_comment_id IS NULL;

SELECT c.comment_id, c.content, c.created_at, u.username, u.fullname, u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.parent_comment_id = ?;

DELETE FROM comments WHERE comment_id = ?;
```

---

## Reactions

```http
POST   /api/reactions/tweets/:tweetId     → likeTweet
DELETE /api/reactions/tweets/:tweetId     → unlikeTweet
POST   /api/reactions/comments/:commentId → likeComment
DELETE /api/reactions/comments/:commentId → unlikeComment
```

```sql
INSERT IGNORE INTO reactions (user_id, tweet_id) VALUES (?, ?);

DELETE FROM reactions WHERE user_id = ? AND tweet_id = ?;

INSERT IGNORE INTO comment_reactions (user_id, comment_id) VALUES (?, ?);

DELETE FROM comment_reactions WHERE user_id = ? AND comment_id = ?;
```

---

## Notifications

```http
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

---

## Queries

```sql
-- Get notifications
SELECT * 
FROM notifications 
WHERE user_id = ? 
ORDER BY created_at DESC;

-- Mark single as read
UPDATE notifications 
SET is_read = 1 
WHERE notification_id = ? AND user_id = ?;

-- Mark all as read
UPDATE notifications 
SET is_read = 1 
WHERE user_id = ?;

-- Delete notification
DELETE FROM notifications 
WHERE notification_id = ? AND user_id = ?;
```

---

## Notification Creation (Internal Use)

```sql
-- Like Tweet
INSERT INTO notifications (user_id, actor_id, tweet_id, type)
VALUES (?, ?, ?, 'like');

-- Comment on Tweet
INSERT INTO notifications (user_id, actor_id, tweet_id, comment_id, type)
VALUES (?, ?, ?, ?, 'comment');

-- Reply to Comment
INSERT INTO notifications (user_id, actor_id, tweet_id, comment_id, type)
VALUES (?, ?, ?, ?, 'reply');

-- Follow User
INSERT INTO notifications (user_id, actor_id, type)
VALUES (?, ?, 'follow');

-- Retweet
INSERT INTO notifications (user_id, actor_id, tweet_id, type)
VALUES (?, ?, ?, 'retweet');
```

---



# Notes

* `EXISTS` is used for `isLiked` and `isRetweeted`
* `UNION ALL` merges tweets and retweets
* `LEFT JOIN` ensures media is optional
* Composite keys prevent duplicate likes/retweets

---

# Run Project

```bash
npm install
npm run dev
```

---

# Author

Milan Patel


