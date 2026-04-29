import { RowDataPacket } from "mysql2";

export interface CommentResponse extends RowDataPacket {
  comment_id: number;
  content: string;
  created_at: Date;

  username: string;
  fullname: string;
  profile_image: string | null;
}