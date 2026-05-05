-- USERS
SELECT * FROM users;

-- TWEETS
SELECT * FROM tweets;

-- TWEET MEDIA
SELECT * FROM tweet_media;

-- FOLLOWS
SELECT * FROM follows;

-- RETWEETS
SELECT * FROM retweets;

-- REACTIONS
SELECT * FROM reactions;

-- COMMENTS
SELECT * FROM comments;

-- COMMENT REACTIONS
SELECT * FROM comment_reactions;

-- NOTIFICATIONS
SELECT * FROM notifications;

-- OTPS
SELECT * FROM password_reset_otp;

-- Get User Tweets
SELECT T.tweet_id, T.content, T.created_at, M.media_type, M.media_url, 'tweet' as type
FROM tweets T LEFT JOIN tweet_media M
ON T.tweet_id=M.tweet_id
WHERE T.user_id=1
UNION ALL

SELECT T.tweet_id, T.content, R.created_at, M.media_type, M.media_url, 'retweet' as type
FROM retweets R 
JOIN 
tweets T ON R.tweet_id=T.tweet_id 
JOIN tweet_media M
ON T.tweet_id=M.tweet_id
WHERE T.user_id=1;

-- Get user Likes 
SELECT t.*
FROM reactions r
JOIN tweets t ON r.tweet_id = t.tweet_id
WHERE r.user_id = ?
ORDER BY r.created_at DESC;

-- 



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
WHERE c.user_id = 1
ORDER BY c.created_at DESC;