import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spacer,
} from "@nextui-org/react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { PostType } from "@/types/PostType";
import {
  Flag,
  MessageCircle,
  Minus,
  MoreVertical,
  Plus,
  Shield,
  ShieldAlert,
  ShieldX,
  Trash,
  X,
} from "lucide-react";
import LikeButton from "./LikeButton";
import { PostStyle } from "@/types/PostStyle";
import { UserType } from "@/types/UserType";
import { useState } from "react";
import { getCookie } from "@/helpers/cookie";
import { toast } from "react-toastify";

export default function PostCard({
  post,
  style,
  user,
}: {
  post: PostType;
  style: PostStyle;
  user?: UserType;
}) {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <Card
      className="bg-opacity-60 !duration-250 !ease-linear !transition-all"
      style={{ display: hidden ? "none" : "flex" }}
    >
      <CardBody className="p-5">
        {(style == "cozy" || style == "adaptive") &&
          (minimized ? (
            <div className="flex items-center justify-between">
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
                      classNames={{
                        base: "bg-transparent",
                      }}
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
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => setMinimized(false)}
              >
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <p className="text-2xl">{post.title}</p>
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => setMinimized(true)}
                >
                  <Minus size={16} />
                </Button>
              </div>

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
                    classNames={{
                      base: "bg-transparent",
                    }}
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

              <div
                className="prose dark:prose-invert !duration-250 !ease-linear !transition-all"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <Spacer y={4} />

              <div className="flex gap-3">
                <LikeButton post={post} />
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => {
                    toast.warning("Comment functionality coming soon");
                  }}
                >
                  <MessageCircle size={16} /> {0}
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="bordered" isIconOnly>
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="text-[#333] dark:text-white">
                    <DropdownSection showDivider={user?.mod} title="Actions">
                      <DropdownItem
                        key="report"
                        startContent={<Flag />}
                        description="Report this post to moderators to handle"
                        onPress={() => {
                          toast.warning("Report functionality coming soon");
                        }}
                      >
                        Create Report
                      </DropdownItem>
                      {user?.slug == post.author.slug ? (
                        <DropdownItem
                          key="delete"
                          startContent={<Trash />}
                          description="Delete your post"
                          onPress={async () => {
                            const response = await fetch(
                              process.env.NEXT_PUBLIC_MODE === "PROD"
                                ? "https://d2jam.com/api/v1/post"
                                : "http://localhost:3005/api/v1/post",
                              {
                                body: JSON.stringify({
                                  postId: post.id,
                                  username: getCookie("user"),
                                }),
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  authorization: `Bearer ${getCookie("token")}`,
                                },
                                credentials: "include",
                              }
                            );

                            if (response.ok) {
                              toast.success("Deleted post");
                              setHidden(true);
                            } else {
                              toast.error("Error while deleting post");
                            }
                          }}
                        >
                          Delete
                        </DropdownItem>
                      ) : (
                        <></>
                      )}
                    </DropdownSection>
                    <DropdownSection title="Mod Zone">
                      {user?.mod ? (
                        <DropdownItem
                          key="remove"
                          startContent={<X />}
                          description="Remove this post"
                          onPress={async () => {
                            const response = await fetch(
                              process.env.NEXT_PUBLIC_MODE === "PROD"
                                ? "https://d2jam.com/api/v1/post"
                                : "http://localhost:3005/api/v1/post",
                              {
                                body: JSON.stringify({
                                  postId: post.id,
                                  username: getCookie("user"),
                                }),
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  authorization: `Bearer ${getCookie("token")}`,
                                },
                                credentials: "include",
                              }
                            );

                            if (response.ok) {
                              toast.success("Removed post");
                              setHidden(true);
                            } else {
                              toast.error("Error while removing post");
                            }
                          }}
                        >
                          Remove
                        </DropdownItem>
                      ) : (
                        <></>
                      )}
                      {user?.admin && !post.author.mod ? (
                        <DropdownItem
                          key="promote-mod"
                          startContent={<Shield />}
                          description="Promote user to Mod"
                        >
                          Appoint as mod
                        </DropdownItem>
                      ) : (
                        <></>
                      )}
                      {user?.admin &&
                      post.author.mod &&
                      post.author.id !== user.id ? (
                        <DropdownItem
                          key="demote-mod"
                          startContent={<ShieldX />}
                          description="Demote user from Mod"
                        >
                          Remove as mod
                        </DropdownItem>
                      ) : (
                        <></>
                      )}
                      {user?.admin && !post.author.admin ? (
                        <DropdownItem
                          key="promote-admin"
                          startContent={<ShieldAlert />}
                          description="Promote user to Admin"
                        >
                          Appoint as admin
                        </DropdownItem>
                      ) : (
                        <></>
                      )}
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          ))}
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
                  classNames={{
                    base: "bg-transparent",
                  }}
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
                  classNames={{
                    base: "bg-transparent",
                  }}
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
      </CardBody>
    </Card>
  );
}
