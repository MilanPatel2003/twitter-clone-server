create database if not exists twitter_clone;
use twitter_clone;
-- drop database twitter_clone;

-- SETTING THE GLOBAL TIME 0000 
SET GLOBAL time_zone = '+00:00'; 
SELECT @@global.time_zone, @@session.time_zone;
SET FOREIGN_KEY_CHECKS = 0;

-- USERS
create table users(
user_id bigint auto_increment primary key,	
fullname varchar(100) not null,
username varchar(50) unique not null,
email varchar(60) not null,
hashed_password varchar(255),
dob date not null,
bio TEXT null,
country varchar(50) not null,
profile_image varchar(255) null ,
cover_image varchar(255) null,
created_at timestamp default current_timestamp
);

-- TWEETS
CREATE TABLE tweets (
  tweet_id bigint auto_increment primary key,
  user_id bigint not null,
  content text,
  created_at timestamp default current_timestamp,
  foreign key (user_id) references users(user_id) on delete cascade
);


-- TWEET MEDIA
create table tweet_media(
  media_id bigint auto_increment primary key,
  tweet_id bigint not null,
  media_type varchar(20) not null, -- image or video
  media_url varchar(255) not null,
  foreign key (tweet_id) references tweets(tweet_id) on delete cascade 
);


-- FOLLOWERS/FOLLOWINGS
CREATE TABLE follows (
  follower_id bigint not null,
  followee_id bigint not null,
  created_at timestamp default current_timestamp,
  primary key (follower_id, followee_id),
  foreign key (follower_id) references users(user_id) on delete cascade,
  foreign key (followee_id) references users(user_id) on delete cascade
);


-- RETWEETS
CREATE TABLE retweets (
  user_id bigint not null,
  tweet_id bigint not null,
  created_at timestamp default current_timestamp,
  primary key (user_id, tweet_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (tweet_id) references tweets(tweet_id) on delete cascade
);



-- REACTIONS
CREATE TABLE reactions (
  user_id bigint not null,
  tweet_id bigint not null,
  isLiked boolean default true,
  created_at timestamp default current_timestamp,
  primary key(user_id, tweet_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (tweet_id) references tweets(tweet_id) on delete cascade
);


-- COMMENTS
create table comments (
  comment_id bigint auto_increment primary key,
  tweet_id bigint not null,
  user_id bigint not null,
  comment_content varchar(150) not null,
  parent_comment_id bigint null,
  created_at timestamp default current_timestamp,
  foreign key (tweet_id) references tweets(tweet_id) on delete cascade,
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (parent_comment_id) references comments(comment_id) on delete set null
);


-- COMMENT REACTIONS
CREATE TABLE comment_reactions (
  user_id bigint not null,
  comment_id bigint not null,
  isLiked boolean default true,
  created_at timestamp default current_timestamp,
  primary key (user_id, comment_id),
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (comment_id) REFERENCES comments(comment_id) on delete cascade
);


-- NOTIFICATIONS
create table notifications (
  notification_id bigint auto_increment primary key,
  user_id bigint not null,       -- recipient
  actor_id bigint not null,      -- who triggered the event
  tweet_id bigint null,
  comment_id bigint null,
  notification_type VARCHAR(32) not null,     -- e.g., 'like','reply','follow','retweet','dislike','comment'
  is_read boolean default false,
  created_at timestamp default current_timestamp,
  foreign key (user_id) references users(user_id) on delete cascade,
  foreign key (actor_id) references users(user_id) on delete cascade,
  foreign key (tweet_id) references tweets(tweet_id) on delete set null,
  foreign key (comment_id)  references comments(comment_id) on delete set null
);
