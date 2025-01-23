import { TagType } from "./TagType";
import { UserType } from "./UserType";

export interface PostType {
  id: number;
  slug: string;
  title: string;
  sticky: boolean;
  content: string;
  author: UserType;
  createdAt: Date;
  tags: TagType[];
  likes: [];
  hasLiked: boolean;
}
