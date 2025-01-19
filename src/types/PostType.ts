import { UserType } from "./UserType";

export interface PostType {
  id: number;
  title: string;
  content: string;
  author: UserType;
  createdAt: Date;
  likes: [];
  hasLiked: boolean;
}
