import { Button, Card, CardBody, Chip, User } from "@nextui-org/react";
import { Heart } from "lucide-react";
import { formatDistance } from "date-fns";
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xl">{post.title}</p>

        {post.flairs &&
          Object.values(post.flairs).map((flair) => (
            <div key={flair.id}>
              <Chip>{flair.name}</Chip>
            </div>
          ))}

        <div className="flex items-center gap-3">
          <p>By</p>
          <Link href={`/u/${post.author.slug}`}>
            <User name={post.author.name} />
          </Link>
          <p>
            {formatDistance(new Date(post.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        <p>{post.content}</p>
        <div className="flex justify-between">
          <Button>
            <Heart /> {post.likers.length}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
