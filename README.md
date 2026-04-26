Here’s your **FULL updated README with controller names added (no extra changes, same structure)** 👇

---

# Twitter Clone Backend API

A scalable backend for a Twitter/X style social media platform built with **Node.js**, **TypeScript**, **Express.js**, and **MySQL**.

This project focuses on authentication, modular backend architecture, relational database design, production-ready REST APIs, media handling, and scalable social platform logic.

---

# Tech Stack

* Node.js
* TypeScript
* Express.js
* MySQL
* JWT Authentication
* bcrypt
* Zod Validation
* Cloudinary
* Multer
* dotenv

---

# Core Highlights

* Modular feature-based backend architecture
* Secure JWT authentication system
* Relational SQL schema with foreign keys
* RESTful API design
* Media uploads with Cloudinary
* Centralized error handling
* Request validation using Zod
* Social media interactions (follow, like, comment, retweet)
* Notification system
* Search APIs
* Scalable backend structure for future expansion

---

# Project Structure

```text
src/
│── server.ts
│
├── config/
│   ├── db.ts
│   ├── env.ts
│   └── cloudinary.ts
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tweets/
│   ├── comments/
│   ├── follows/
│   ├── reactions/
│   ├── retweets/
│   ├── notifications/
│   ├── media/
│   └── search/
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── validate.middleware.ts
│   ├── error.middleware.ts
│   └── upload.middleware.ts
│
├── types/
│   └── express.d.ts
│
└── constants/
    └── messages.ts
```

---

# Module Responsibilities

## Auth

* Register user
* Login user
* Current logged-in user
* Logout

## Users

* Public profile
* Update profile
* Update profile image
* Update cover image
* User tweets / replies / likes

## Tweets

* Create tweet
* Delete tweet
* Feed generation
* Single tweet details
* Trending tweets

## Comments

* Comment on tweet
* Reply to comment
* Delete comment
* Fetch tweet comments

## Follows

* Follow user
* Unfollow user
* Followers list
* Following list

## Reactions

* Like / unlike tweet
* Like / unlike comment

## Retweets

* Retweet tweet
* Undo retweet

## Notifications

* Fetch notifications
* Mark as read
* Mark all as read

## Media

* Upload image/video
* Remove media

## Search

* Search users
* Search tweets
* Global search

---

# REST API Endpoints

## Auth

```http
POST /api/auth/register        → registerUser
POST /api/auth/login           → loginUser
GET  /api/auth/me              → getCurrentUser
POST /api/auth/logout          → logoutUser
PUT  /api/auth/password        → updatePassword
```

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

## Tweets

```http
POST   /api/tweets                  → createTweet
GET    /api/tweets/feed             → getFeedTweets
GET    /api/tweets/trending         → getTrendingTweets
GET    /api/tweets/:id              → getTweetById
GET    /api/tweets/user/:userId     → getTweetsByUser
DELETE /api/tweets/:id              → deleteTweet
```

## Comments

```http
POST   /api/comments/:tweetId         → createComment
POST   /api/comments/reply/:commentId → replyToComment
GET    /api/comments/tweet/:tweetId   → getCommentsByTweet
DELETE /api/comments/:id              → deleteComment
```

## Reactions

```http
POST   /api/reactions/tweets/:tweetId     → likeTweet
DELETE /api/reactions/tweets/:tweetId     → unlikeTweet

POST   /api/reactions/comments/:commentId → likeComment
DELETE /api/reactions/comments/:commentId → unlikeComment
```

## Follows

```http
POST   /api/follows/:userId              → followUser
DELETE /api/follows/:userId              → unfollowUser
GET    /api/follows/:userId/followers    → getFollowers
GET    /api/follows/:userId/following    → getFollowing
```

## Retweets

```http
POST   /api/retweets/:tweetId    → retweetTweet
DELETE /api/retweets/:tweetId    → undoRetweet
```

## Notifications

```http
GET /api/notifications               → getNotifications
PUT /api/notifications/:id/read     → markNotificationAsRead
PUT /api/notifications/read-all     → markAllNotificationsAsRead
DELETE /api/notifications/:id       → deleteNotification
```

## Media

```http
POST   /api/media/upload     → uploadMedia
DELETE /api/media/:id        → deleteMedia
```

## Search

```http
GET /api/search/users?q=     → searchUsers
GET /api/search/tweets?q=    → searchTweets
GET /api/search/all?q=       → searchAll
```

---

# Database Tables

* users
* tweets
* tweet_media
* follows
* retweets
* reactions
* comments
* comment_reactions
* notifications

---

# Suggested SQL Optimizations

* Foreign key constraints
* Composite indexes
* Feed query optimization
* Pagination with cursor/offset strategy
* Cascading deletes where appropriate

---

# Security Features

* Password hashing using bcrypt
* JWT protected routes
* Input validation using Zod
* Environment variable protection
* Centralized error responses

---

# Run Project

```bash
npm install
npm run dev
```

---

# Environment Variables

```env
PORT=5000

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=twitter_clone

JWT_SECRET=
JWT_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# Future Improvements

* Real-time notifications with WebSockets
* Direct messaging
* Bookmarks
* Hashtags & trends engine
* Redis caching
* Rate limiting
* Email verification
* OAuth login
* Unit & integration tests
* Docker deployment

---

# Resume Impact

This project demonstrates:

* Backend architecture design
* Secure authentication systems
* Advanced SQL schema design
* REST API engineering
* File/media handling
* Scalable modular code structure
* Production-ready backend practices

---

# Author

**Milan Patel**
