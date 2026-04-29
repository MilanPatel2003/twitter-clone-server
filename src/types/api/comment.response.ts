export interface CommentResponse {
  comment_id: number;
  content: string;
  created_at: Date;

  username: string;
  fullname: string;
  profile_image: string | null;
}