import { Avatar, Button, Card, CardBody, Spacer } from "@nextui-org/react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { PostType } from "@/types/PostType";
import { MessageCircle } from "lucide-react";
import LikeButton from "./LikeButton";

export default function PostCard({ post }: { post: PostType }) {
  return (
    <Card className="bg-opacity-60">
      <CardBody className="p-5">
        <p className="text-2xl">{post.title}</p>

        <div className="flex items-center gap-3 text-xs text-default-500 pt-1">
          <p>By</p>
          <Link
            href={`/u/${post.author.slug}`}
            className="flex items-center gap-2"
          >
            <Avatar
              size="sm"
              className="w-6 h-6"
              src={post.author.profilePicture}
            />
            <p>{post.author.name}</p>
          </Link>
          <p>
            {formatDistance(new Date(post.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        <Spacer y={4} />

        <p>{post.content}</p>

        <Spacer y={4} />

        <div className="flex gap-3">
          <LikeButton post={post} />
          <Button size="sm" variant="bordered">
            <MessageCircle size={16} /> {0}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
