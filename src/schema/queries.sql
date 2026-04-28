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

-- Get User Tweets
SELECT T.tweet_id, T.content, T.created_at, M.media_type, M.media_url
FROM tweets T JOIN tweet_media M
ON T.tweet_id=M.tweet_id
WHERE T.user_id=1;


-- Get user Likes 
SELECT t.*
FROM reactions r
JOIN tweets t ON r.tweet_id = t.tweet_id
WHERE r.user_id = ?
ORDER BY r.created_at DESC;