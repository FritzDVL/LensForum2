import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import { client } from "@/lib/external/lens/protocol-client";
import { incrementThreadRepliesCount } from "@/lib/external/supabase/threads";
import { Address } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { Post, SessionClient, evmAddress, postId, uri } from "@lens-protocol/client";
import { fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";
import { WalletClient } from "viem";

export interface CreateReplyResult {
  success: boolean;
  reply?: Reply;
  error?: string;
}

export interface CreateReplyOptions {
  rootPostId: string; // The thread's root post ID (always comment on this)
  replyToPostId?: string; // Optional: The specific post being replied to (for context)
  replyToUsername?: string; // Optional: Username of person being replied to
  replyToAddress?: Address; // Optional: Address of person being replied to
}

/**
 * Creates a reply using flat chronological structure.
 * All replies comment on the root post, with optional mention metadata for context.
 */
export async function createReply(
  content: string,
  threadAddress: Address,
  threadId: string,
  sessionClient: SessionClient,
  walletClient: WalletClient,
  options: CreateReplyOptions,
): Promise<CreateReplyResult> {
  try {
    if (!sessionClient) {
      return {
        success: false,
        error: "No session client available",
      };
    }

    // 1. Prepare content with mention if replying to someone
    let finalContent = content;
    if (options.replyToUsername) {
      // Add @mention at the start if not already present
      if (!content.trim().startsWith(`@${options.replyToUsername}`)) {
        finalContent = `@${options.replyToUsername} ${content}`;
      }
    }

    // 2. Create metadata with tags for reply context
    const tags: string[] = [];
    if (options.replyToPostId) {
      tags.push(`replyTo:${options.replyToPostId}`);
    }
    if (options.replyToUsername) {
      tags.push(`replyToUser:${options.replyToUsername}`);
    }

    const metadata = textOnly({
      content: finalContent,
      ...(tags.length > 0 && { tags }),
    });

    // 3. Upload metadata to storage
    const acl = immutable(lensChain.id);
    const { uri: replyUri } = await storageClient.uploadAsJson(metadata, { acl });

    // 4. Post to Lens Protocol - ALWAYS comment on root post for flat structure
    const result = await post(sessionClient, {
      contentUri: uri(replyUri),
      commentOn: { post: postId(options.rootPostId) }, // Always root post
      feed: evmAddress(threadAddress),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash: unknown) => fetchPost(client, { txHash: txHash as string }));

    if (result.isErr()) {
      const errorMessage =
        result.error && typeof result.error === "object" && "message" in result.error
          ? (result.error as any).message
          : "Failed to create reply";
      return {
        success: false,
        error: errorMessage,
      };
    }

    const createdPost = result.value as Post;

    // 5. Increment thread replies count
    try {
      await incrementThreadRepliesCount(threadId);
    } catch (error) {
      console.warn("Failed to increment thread replies count:", error);
      // Don't fail the entire operation for this
    }

    // 6. Transform post to reply - using the correct author parameter
    const reply = adaptPostToReply(createdPost);

    return {
      success: true,
      reply,
    };
  } catch (error) {
    console.error("Reply creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create reply",
    };
  }
}
