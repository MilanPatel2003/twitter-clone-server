import { RowDataPacket } from "mysql2";

export interface NotificationRow extends RowDataPacket {
  notification_id: number;
  user_id: number;
  actor_id: number;
  tweet_id?: number | null;
  comment_id?: number | null;
  type: "like" | "comment" | "reply" | "follow" | "retweet";
  is_read: number; // MySQL → 0/1
  created_at: Date;
}