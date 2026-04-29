import { RowDataPacket } from "mysql2";

export interface TweetRow extends RowDataPacket {
  tweet_id: number;
  user_id: number;
  content: string;
  created_at: Date;
}