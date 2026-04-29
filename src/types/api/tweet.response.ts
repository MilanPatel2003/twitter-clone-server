export interface TweetResponse {
  tweet_id: number;
  content: string;
  created_at: Date;

  username: string;
  fullname: string;
  profile_image: string | null;

  media_url: string | null;
  media_type: "image" | "video" | null;

  like_count: number;
  retweet_count: number;

  isLiked: boolean;
  isRetweeted: boolean;

  type: "tweet" | "retweet";
}