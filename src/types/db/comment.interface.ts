import { RowDataPacket } from "mysql2";

export interface CommentRow extends RowDataPacket {
  comment_id: number;
  user_id: number;
  tweet_id: number;
  content: string;
  parent_comment_id?: number | null;
  created_at: Date;
}