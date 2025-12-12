"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ReplyVoting } from "../reply/reply-voting";
import { InReplyToIndicator } from "./in-reply-to-indicator";
import { ThreadReplyBox } from "./thread-reply-box";
import { ThreadReplyModeratorActions } from "./thread-reply-moderator-actions";
import { ContentRenderer } from "@/components/shared/content-renderer";
import { ThreadReplyActions } from "@/components/thread/thread-reply-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Community } from "@/lib/domain/communities/types";
import { getReplyContent } from "@/lib/domain/replies/content";
import { getReplyContext } from "@/lib/domain/replies/context";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { postId } from "@lens-protocol/react";
import { AnimatePresence, motion } from "framer-motion";

interface ThreadReplyCardProps {
  reply: Reply;
  thread: Thread;
  community?: Community;
}

export function ThreadReplyCard({ reply, thread, community }: ThreadReplyCardProps) {
  const { content, image, video } = getReplyContent(reply.post);
  const threadAddress = thread.rootPost.feed.address;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showPlusOne, setShowPlusOne] = useState(false);

  const { createReply } = useReplyCreate();

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await createReply({
        content: replyContent,
        threadRootPostId: thread.rootPost.id, // Always reply to root
        threadAddress,
        threadId: thread.id,
        replyToPostId: reply.id, // Track who we're replying to
        replyToUsername: reply.post.author.username?.value,
        replyToAddress: reply.post.author.address,
      });
      setReplyContent("");
      setShowReplyBox(false);
      setShowPlusOne(true);
    } finally {
    }
  };

  useEffect(() => {
    if (showPlusOne) {
      const timeout = setTimeout(() => setShowPlusOne(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [showPlusOne]);

  const canReply = reply.post.operations?.canComment.__typename === "PostOperationValidationPassed";
  const canTip = reply.post.operations?.canTip;

  return (
    <div className="space-y-2" id={reply.id}>
      <Card className="rounded-lg bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <ReplyVoting postid={postId(reply.id)} />
            </div>
            <div className="min-w-0 flex-1">
              {/* Top row: author info and show context button at top right */}
              <div className="relative mb-3 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-center sm:gap-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <Link
                    href={`/u/${reply.post.author.username?.value}`}
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                      <AvatarImage src={reply.post.author.metadata?.picture} />
                      <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                        {reply.post.author.metadata?.name?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{reply.post.author.metadata?.name}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    {community && <ThreadReplyModeratorActions reply={reply} community={community} />}
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {getTimeAgo(new Date(reply.post.timestamp))}
                    </span>
                  </div>
                </div>
              </div>

              {/* In Reply To Indicator */}
              {(() => {
                const replyContext = getReplyContext(reply.post);
                return replyContext?.replyToUsername ? (
                  <InReplyToIndicator username={replyContext.replyToUsername} />
                ) : null;
              })()}

              {/* Content */}
              <ContentRenderer content={{ content, image, video }} className="rich-text-content mb-2" />
              {/* Reply button and tip button bottom */}
              <div className="mt-3 flex flex-row items-center justify-between gap-2">
                <div className="relative flex items-center gap-2">
                  <AnimatePresence>
                    {showPlusOne && (
                      <motion.span
                        initial={{ opacity: 0, y: -16, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1.1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.8 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-green-500"
                        style={{ zIndex: 10 }}
                      >
                        +1
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex w-full justify-end sm:w-auto">
                  <ThreadReplyActions
                    replyId={reply.id}
                    setReplyingTo={() => setShowReplyBox(true)}
                    canReply={canReply}
                    canTip={!!canTip}
                  />
                </div>
              </div>
              {showReplyBox && (
                <ThreadReplyBox
                  value={replyContent}
                  onCancel={() => {
                    setShowReplyBox(false);
                    setReplyContent("");
                  }}
                  onSubmit={handleReply}
                  onChange={setReplyContent}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
