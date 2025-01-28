import { CommentType } from "./CommentType";
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
  comments: CommentType[];
  tags: TagType[];
  likes: [];
  hasLiked: boolean;
}
