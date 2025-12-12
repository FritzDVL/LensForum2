import { Post } from "@lens-protocol/client";

export interface ReplyContext {
  replyToPostId?: string;
  replyToUsername?: string;
}

/**
 * Extract reply context from post metadata tags
 * Tags format: "replyTo:postId" and "replyToUser:username"
 */
export function getReplyContext(post: Post): ReplyContext | null {
  // Check if metadata has tags (only TextOnlyMetadata has tags)
  if (!post.metadata || post.metadata.__typename !== "TextOnlyMetadata") {
    return null;
  }

  const tags = post.metadata.tags;
  if (!tags || tags.length === 0) {
    return null;
  }

  const context: ReplyContext = {};

  for (const tag of tags) {
    if (tag.startsWith("replyTo:")) {
      context.replyToPostId = tag.replace("replyTo:", "");
    } else if (tag.startsWith("replyToUser:")) {
      context.replyToUsername = tag.replace("replyToUser:", "");
    }
  }

  return context.replyToPostId || context.replyToUsername ? context : null;
}
