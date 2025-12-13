"use client";

import { useState } from "react";
import { ThreadComposer } from "@/components/thread/thread-composer";
import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadReplies } from "@/hooks/queries/use-thread-replies";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Community } from "@/lib/domain/communities/types";
import { getReplyContent } from "@/lib/domain/replies/content";
import { getReplyContext } from "@/lib/domain/replies/context";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadRepliesListProps {
  thread: Thread;
  community: Community;
}

interface ReplyContext {
  replyId: string;
  username?: string;
  avatar?: string;
  content?: string;
}

export function ThreadRepliesList({ thread, community }: ThreadRepliesListProps) {
  const { data: replies = [], loading } = useThreadReplies(thread);
  const { createReply } = useReplyCreate();
  const [showComposer, setShowComposer] = useState(false);
  const [replyContext, setReplyContext] = useState<ReplyContext | null>(null);

  const handleReplyClick = (reply: Reply) => {
    const { content } = getReplyContent(reply.post);
    setReplyContext({
      replyId: reply.id,
      username: reply.post.author.username?.value,
      avatar: reply.post.author.metadata?.picture,
      content,
    });
    setShowComposer(true);

    // Scroll to bottom smoothly
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleSubmitReply = async (content: string) => {
    await createReply({
      content,
      threadRootPostId: thread.rootPost.id,
      threadAddress: thread.rootPost.feed.address,
      threadId: thread.id,
      replyToPostId: replyContext?.replyId,
      replyToUsername: replyContext?.username,
      replyToAddress: replyContext?.replyId
        ? replies.find(r => r.id === replyContext.replyId)?.post.author.address
        : undefined,
    });
    setShowComposer(false);
    setReplyContext(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading replies..." />
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground">{replies.length} Replies</h3>
        {replies.map((reply, index) => {
          // Heuristic: Find the latest reply by the mentioned user that appeared BEFORE this reply
          const replyContext = getReplyContext(reply.post);
          const parentReply = replyContext?.replyToUsername
            ? replies
                .slice(0, index)
                .reverse()
                .find(prev => prev.post.author.username?.value === replyContext.replyToUsername)
            : undefined;

          return (
            <ThreadReplyCard
              key={reply.id}
              reply={reply}
              thread={thread}
              community={community}
              onReplyClick={() => handleReplyClick(reply)}
              parentReplyId={parentReply?.id}
            />
          );
        })}
      </div>

      {/* Composer at bottom */}
      {showComposer && (
        <div className="mt-8">
          <ThreadComposer
            onSubmit={handleSubmitReply}
            onCancel={() => {
              setShowComposer(false);
              setReplyContext(null);
            }}
            replyingToUsername={replyContext?.username}
            replyingToAvatar={replyContext?.avatar}
            replyingToContent={replyContext?.content}
          />
        </div>
      )}
    </>
  );
}
