import { TagType } from "./TagType";
import { UserType } from "./UserType";

export interface PostType {
  id: number;
  title: string;
  content: string;
  author: UserType;
  createdAt: Date;
  tags: TagType[];
  likes: [];
  hasLiked: boolean;
}
