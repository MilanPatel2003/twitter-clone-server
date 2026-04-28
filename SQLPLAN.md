Here’s your **final polished README section** with:

✅ Queries
✅ Routes
✅ Controller names
✅ Clean structure (production-ready)

You can copy-paste directly 👇

---

# 📦 Backend API + SQL Reference

This section maps **API routes → controllers → SQL queries** for the Twitter Clone backend.

---

# 🔐 Auth

```http
POST /api/auth/register        → registerUser
POST /api/auth/login           → loginUser
GET  /api/auth/me              → getCurrentUser
POST /api/auth/logout          → logoutUser
PUT  /api/auth/password        → updatePassword
```

> 🔹 Auth handled via JWT — no direct SQL listed here.

---

# 👤 Users

## 🔹 Get User Tweets → `getUserTweets`

```http
GET /api/users/:username/tweets
```

```sql
-- User's own tweets
SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  -- Counts
  (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,

  -- Like status
  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked,

  'tweet' AS type
FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.user_id = ?

UNION ALL

-- User's retweets
SELECT 
  t.tweet_id,
  t.content,
  r.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  (SELECT COUNT(*) FROM reactions r3 WHERE r3.tweet_id = t.tweet_id) AS like_count,
  (SELECT COUNT(*) FROM retweets rt2 WHERE rt2.tweet_id = t.tweet_id) AS retweet_count,

  EXISTS (
    SELECT 1 FROM reactions r4 
    WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
  ) AS isLiked,

  'retweet' AS type
FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE r.user_id = ?

ORDER BY created_at DESC;
```

---

## 🔹 Get Followers → `getFollowers`

```http
GET /api/follows/:userId/followers
```

```sql
SELECT 
  u.user_id,
  u.username,
  u.fullname,
  u.profile_image
FROM follows f
JOIN users u ON f.follower_id = u.user_id
WHERE f.followee_id = ?;
```

---

## 🔹 Get Following → `getFollowing`

```http
GET /api/follows/:userId/following
```

```sql
SELECT 
  u.user_id,
  u.username,
  u.fullname,
  u.profile_image
FROM follows f
JOIN users u ON f.followee_id = u.user_id
WHERE f.follower_id = ?;
```

---

# 🐦 Tweets

## 🔹 Get Feed → `getFeedTweets`

```http
GET /api/tweets/feed
```

```sql
-- Fetch tweets from users I follow
SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  m.media_url,
  m.media_type,

  -- Check if current user liked this tweet
  EXISTS (
    SELECT 1 FROM reactions r 
    WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
  ) AS isLiked,

  'tweet' AS type
FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

UNION ALL

-- Fetch retweets from users I follow
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
  ) AS isLiked,

  'retweet' AS type
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

## 🔹 Get Tweet By ID → `getTweetById`

```http
GET /api/tweets/:id
```

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

  (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,

  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ) AS isLiked

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.tweet_id = ?;
```

---

## 🔹 Create Tweet → `createTweet`

```http
POST /api/tweets
```

```sql
INSERT INTO tweets (user_id, content)
VALUES (?, ?);
```

---

## 🔹 Delete Tweet → `deleteTweet`

```http
DELETE /api/tweets/:id
```

```sql
DELETE FROM tweets WHERE tweet_id = ?;
```

---

# ❤️ Reactions (Likes)

## 🔹 Like Tweet → `likeTweet`

```http
POST /api/reactions/tweets/:tweetId
```

```sql
INSERT IGNORE INTO reactions (user_id, tweet_id)
VALUES (?, ?);
```

---

## 🔹 Unlike Tweet → `unlikeTweet`

```http
DELETE /api/reactions/tweets/:tweetId
```

```sql
DELETE FROM reactions
WHERE user_id = ? AND tweet_id = ?;
```

---

## 🔹 Like Comment → `likeComment`

```http
POST /api/reactions/comments/:commentId
```

```sql
INSERT IGNORE INTO comment_reactions (user_id, comment_id)
VALUES (?, ?);
```

---

## 🔹 Unlike Comment → `unlikeComment`

```http
DELETE /api/reactions/comments/:commentId
```

```sql
DELETE FROM comment_reactions
WHERE user_id = ? AND comment_id = ?;
```

---

# 🔁 Retweets

## 🔹 Retweet → `retweetTweet`

```http
POST /api/retweets/:tweetId
```

```sql
INSERT IGNORE INTO retweets (user_id, tweet_id)
VALUES (?, ?);
```

---

## 🔹 Undo Retweet → `undoRetweet`

```http
DELETE /api/retweets/:tweetId
```

```sql
DELETE FROM retweets
WHERE user_id = ? AND tweet_id = ?;
```

---

# 👥 Follows

## 🔹 Follow User → `followUser`

```http
POST /api/follows/:userId
```

```sql
INSERT INTO follows (follower_id, followee_id)
VALUES (?, ?);
```

---

## 🔹 Unfollow User → `unfollowUser`

```http
DELETE /api/follows/:userId
```

```sql
DELETE FROM follows
WHERE follower_id = ? AND followee_id = ?;
```

---

# 💬 Comments

## 🔹 Add Comment → `createComment`

```http
POST /api/comments/:tweetId
```

```sql
INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, NULL);
```

---

## 🔹 Reply to Comment → `replyToComment`

```http
POST /api/comments/reply/:commentId
```

```sql
-- Step 1: Get tweet_id
SELECT tweet_id FROM comments WHERE comment_id = ?;

-- Step 2: Insert reply
INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
VALUES (?, ?, ?, ?);
```

---

## 🔹 Get Comments → `getCommentsByTweet`

```http
GET /api/comments/tweet/:tweetId
```

```sql
SELECT 
  c.comment_id,
  c.content,
  c.created_at,
  u.username,
  u.fullname,
  u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.tweet_id = ?
AND c.parent_comment_id IS NULL
ORDER BY c.created_at DESC;
```

---

## 🔹 Get Replies → `getReplies`

```sql
SELECT 
  c.comment_id,
  c.content,
  c.created_at,
  u.username,
  u.fullname,
  u.profile_image
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.parent_comment_id = ?
ORDER BY c.created_at ASC;
```

---

## 🔹 Delete Comment → `deleteComment`

```http
DELETE /api/comments/:id
```

```sql
DELETE FROM comments WHERE comment_id = ?;
```

---

# 🔔 Notifications

## 🔹 Get Notifications → `getNotifications`

```http
GET /api/notifications
```

```sql
SELECT 
  n.id,
  n.type,
  n.is_read,
  n.created_at,
  u.username,
  u.fullname,
  u.profile_image,
  t.tweet_id,
  t.content
FROM notifications n
JOIN users u ON n.sender_id = u.user_id
LEFT JOIN tweets t ON n.tweet_id = t.tweet_id
WHERE n.user_id = ?
ORDER BY n.created_at DESC;
```

---

## 🔹 Mark One as Read → `markNotificationAsRead`

```http
PUT /api/notifications/:id/read
```

```sql
UPDATE notifications
SET is_read = 1
WHERE id = ?;
```

---

## 🔹 Mark All as Read → `markAllNotificationsAsRead`

```http
PUT /api/notifications/read-all
```

```sql
UPDATE notifications
SET is_read = 1
WHERE user_id = ?;
```

---

## 🔹 Delete Notification → `deleteNotification`

```http
DELETE /api/notifications/:id
```

```sql
DELETE FROM notifications
WHERE id = ?;
```

---

# 🖼️ Media

## 🔹 Upload Media → `uploadMedia`

```http
POST /api/media/upload
```

Handled via **Cloudinary + Multer**

---

## 🔹 Delete Media → `deleteMedia`

```http
DELETE /api/media/:id
```

```sql
DELETE FROM tweet_media WHERE id = ?;
```

---

# 🧠 Final Notes

* `EXISTS` used for boolean flags like `isLiked`
* `INSERT IGNORE` prevents duplicate likes/retweets
* `UNION ALL` combines tweets + retweets
* `parent_comment_id` enables threaded replies
* Notifications are triggered on actions (like, follow, comment, retweet)

---

# 🚀 Summary

This backend supports:

* Full social graph (follow/unfollow)
* Tweet + media system
* Likes & retweets
* Threaded comments
* Notification system
* Scalable SQL design

---
