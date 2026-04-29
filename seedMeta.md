Got it — this will match exactly your seed file (no assumptions added) 👇


---

Seed Data Reference

Users

| user_id | username | fullname     | email            |
|--------|----------|--------------|------------------|
| 1      | milan    | Milan Patel  | milan@test.com   |
| 2      | john     | John Doe     | john@test.com    |
| 3      | jane     | Jane Smith   | jane@test.com    |


---

Follows

| follower_id | followee_id |
|------------|-------------|
| 1          | 2           |
| 1          | 3           |
| 2          | 1           |


---

Tweets

| tweet_id | user_id | content                  |
|----------|---------|--------------------------|
| 1        | 1       | Tweet 1 from user 1      |
| 2        | 1       | Tweet 2 from user 1      |
| 3        | 1       | Tweet 3 from user 1      |
| 4        | 2       | Tweet 1 from user 2      |
| 5        | 2       | Tweet 2 from user 2      |
| 6        | 2       | Tweet 3 from user 2      |
| 7        | 3       | Tweet 1 from user 3      |
| 8        | 3       | Tweet 2 from user 3      |
| 9        | 3       | Tweet 3 from user 3      |


---

Tweet Media

| media_id | tweet_id | media_type | media_url                      |
|----------|----------|------------|--------------------------------|
| 1        | 1        | image      | https://dummyimage.com/600x400 |


---

Retweets

| user_id | tweet_id |
|---------|----------|
| 1       | 5        |
| 1       | 6        |
| 2       | 1        |
| 3       | 2        |


---

Reactions (Likes)

| user_id | tweet_id |
|---------|----------|
| 1       | 2        |
| 2       | 1        |
| 3       | 1        |


---

Comments

| comment_id | user_id | tweet_id | content     | parent_comment_id |
|------------|---------|----------|-------------|-------------------|
| 1          | 2       | 1        | Nice tweet! | NULL              |
| 2          | 1       | 1        | Thanks!     | 1                 |


---

Notifications

| notification_id | user_id | actor_id | type    | tweet_id | comment_id |
|-----------------|---------|----------|---------|----------|------------|
| 1               | 1       | 2        | like    | 1        | NULL       |
| 2               | 1       | 2        | follow  | NULL     | NULL       |
| 3               | 1       | 2        | comment | 1        | 1          |


---

Notes

- tweetIds array order:
  [1,2,3,4,5,6,7,8,9]

- Only ONE media row exists (tweet_id = 1)

- Retweets:
  user1 → tweets 5,6
  user2 → tweet 1
  user3 → tweet 2

- Likes:
  tweet 1 → liked by user2, user3
  tweet 2 → liked by user1

- Comments:
  comment 1 = root
  comment 2 = reply to comment 1


---

This is 100% aligned with your actual seed script, no extra assumptions.

If you want next, I can:

generate **expected API responses (feed / tweet / profile)** from this data

or help you **debug feed output using this dataset**


Just tell 👍
