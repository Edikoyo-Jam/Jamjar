import { Avatar, Button, Card, CardBody, Spacer } from "@nextui-org/react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { PostType } from "@/types/PostType";
import { MessageCircle } from "lucide-react";
import LikeButton from "./LikeButton";
import { PostStyle } from "@/types/PostStyle";

export default function PostCard({
  post,
  style,
}: {
  post: PostType;
  style: PostStyle;
}) {
  return (
    <Card className="bg-opacity-60">
      <CardBody className="p-5">
        {style == "cozy" && (
          <div>
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
          </div>
        )}
        {style == "compact" && (
          <div>
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
          </div>
        )}
        {style == "ultra" && (
          <div className="flex items-center gap-4">
            <p>{post.title}</p>

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
          </div>
        )}
        {style == "adaptive" && (
          <div>
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
          </div>
        )}
      </CardBody>
    </Card>
  );
}
