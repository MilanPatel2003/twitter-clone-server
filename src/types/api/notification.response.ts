export interface NotificationResponse {
  notification_id: number;
  type: "like" | "comment" | "reply" | "follow" | "retweet";
  is_read: boolean;
  created_at: Date;

  actor_id: number;
  actor_username: string;
  actor_fullname: string;
  actor_profile_image: string | null;

  tweet_id?: number;
  comment_id?: number;
}