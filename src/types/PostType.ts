export interface PostType {
  id: number;
  title: string;
  content: string;
  author: {
    slug: string;
    profilePicture: string;
    name: string;
  };
  createdAt: Date;
  likers: [];
}
