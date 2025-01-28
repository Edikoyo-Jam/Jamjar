import { UserType } from "./UserType";

export interface CommentType {
  id: number;
  content: string;
  children: CommentType[];
  author: UserType;
  createdAt: Date;
  likes: [];
  hasLiked: boolean;
}
