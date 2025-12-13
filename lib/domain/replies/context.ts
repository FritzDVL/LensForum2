import { Post } from "@lens-protocol/client";

export interface ReplyContext {
  replyToUsername?: string;
}

/**
 * Extract reply context from post content by parsing @mentions
 * If content starts with @username, we assume it's a reply to that user
 */
export function getReplyContext(post: Post): ReplyContext | null {
  // Check if metadata has content
  if (!post.metadata || post.metadata.__typename !== "TextOnlyMetadata") {
    return null;
  }

  const content = post.metadata.content;
  if (!content) {
    return null;
  }

  // Check if content starts with @mention (supports namespaced handles like @lens/user)
  const mentionMatch = content.trim().match(/^@([\w\/-]+)/);
  if (mentionMatch) {
    return {
      replyToUsername: mentionMatch[1],
    };
  }

  return null;
}
