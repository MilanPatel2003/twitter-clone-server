import { RowDataPacket } from "mysql2";

export interface MediaRow extends RowDataPacket {
  media_url: string | null;
  media_type: "image" | "video" | null;
}