import { TagCategoryType } from "./TagCategoryType";

export interface TagType {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  autoRegex: string;
  modOnly: boolean;
  priority: boolean;
  alwaysAdded: boolean;
  icon: string;
  category: TagCategoryType;
}
