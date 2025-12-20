import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { Address } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Account, Post } from "@lens-protocol/client";

export const adaptFeedToThread = async (
  author: Account,
  threadDb: CommunityThreadSupabase,
  rootPost: Post,
): Promise<Thread> => {
  const { title, summary } = getThreadTitleAndSummary(rootPost);

  return {
    id: threadDb.id,
    community: threadDb.community.lens_group_address as Address,
    rootPost,
    author: rootPost.author,
    repliesCount: rootPost.stats.comments || 0,
    isVisible: threadDb.visible,
    created_at: threadDb.created_at,
    title,
    summary,
    slug: threadDb.slug,
    updatedAt: threadDb.updated_at,
    classification: {
      publication_id: threadDb.root_post_id,
      category: (threadDb as any).thread_categories?.[0]?.categories,
      tags: (threadDb as any).thread_tags?.map((tt: any) => tt.tags) || [],
    },
  };
};

export const adaptExternalFeedToThread = (rootPost: Post): Thread => {
  const { title, summary } = getThreadTitleAndSummary(rootPost);
  return {
    id: `external-` + rootPost.id,
    community: rootPost.feed?.group?.address,
    rootPost,
    author: rootPost.author,
    repliesCount: rootPost.stats?.comments || 0,
    isVisible: true,
    created_at: rootPost.timestamp ? new Date(rootPost.timestamp).toISOString() : new Date().toISOString(),
    title,
    summary,
    updatedAt: rootPost.timestamp ? new Date(rootPost.timestamp).toISOString() : new Date().toISOString(),
    app: rootPost.app?.metadata?.name || "Other app",
    slug: rootPost.slug,
  };
};

export const adaptDbThreadToThread = (threadDb: CommunityThreadSupabase): Thread => {
  // Mock a minimal RootPost to satisfy the type definition if needed,
  // or better, update the Thread type to make rootPost optional?
  // For now, let's create a partial mock to avoid breaking the UI that expects rootPost.

  const mockPost: any = {
    id: threadDb.root_post_id,
    stats: { comments: 0, upvotes: 0, downvotes: 0 },
    metadata: { content: threadDb.summary || "" },
    app: { metadata: { name: "Web3Forum" } },
  };

  return {
    id: threadDb.id,
    community: threadDb.community.lens_group_address as Address,
    author: {
      username: { localName: "unknown" },
      address: threadDb.author as Address,
      metadata: { picture: "" },
    } as any,
    rootPost: mockPost,
    repliesCount: 0,
    isVisible: threadDb.visible,
    created_at: threadDb.created_at,
    title: threadDb.title,
    summary: threadDb.summary,
    slug: threadDb.slug,
    updatedAt: threadDb.updated_at,
    classification: {
      publication_id: threadDb.root_post_id,
      category: (threadDb as any).thread_categories?.[0]?.categories,
      tags: (threadDb as any).thread_tags?.map((tt: any) => tt.tags) || [],
    },
  };
};
