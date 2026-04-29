import { RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  bio: string | null;
  profile_image: string | null;   
}