import { adaptExternalFeedToThread, adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsBatch, fetchPostsByFeed } from "@/lib/external/lens/primitives/posts";
import { fetchCommunityThreads, fetchThread } from "@/lib/external/supabase/threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";

export interface ThreadsResult {
  success: boolean;
  threads: Thread[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  error?: string;
}

/**
 * Gets all threads for a community using optimized batch operations
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getCommunityThreads(
  community: Community,
  options?: {
    limit?: number;
    offset?: number;
    showAllPosts?: boolean;
    cursor?: string;
    categorySlug?: string;
    tagSlug?: string;
  },
): Promise<ThreadsResult> {
  try {
    const {
      limit = THREADS_PER_PAGE,
      offset = 0,
      showAllPosts = false,
      cursor = undefined,
      categorySlug,
      tagSlug,
    } = options || {};

    if (showAllPosts) {
      // ... (existing logic for showAllPosts)
      // Note: Filtering by category/tag on Lens Feed directly is harder without an indexer.
      // For now, we assume filters only apply when showAllPosts=false (Supabase mode).
      const lensResult = await fetchPostsByFeed(community.feed.address, undefined, { sort: "desc", limit, cursor });
      // ...
      // (Rest of showAllPosts logic remains same for now)
      const lensPosts = lensResult.posts;
      const dbThreads = await Promise.all(lensPosts.map(post => fetchThread({ rootPostId: post.id })));
      const threadPromises = lensPosts.map(async (post, idx) => {
        const dbThread = dbThreads[idx];
        if (!dbThread) {
          return adaptExternalFeedToThread(post as any);
        }
        return await adaptFeedToThread(post.author, dbThread, post);
      });
      const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

      return {
        success: true,
        threads,
        nextCursor: lensResult.pageInfo?.next ?? null,
        prevCursor: lensResult.pageInfo?.prev ?? null,
      };
    } else {
      // 1. Fetch threads from DB with filters
      const dbThreads = await fetchCommunityThreads(community.id, limit, offset, { categorySlug, tagSlug });
      // 2. Fetch posts in Lens for those threads
      const rootPostIds = dbThreads.map(t => t.root_post_id).filter((id): id is string => !!id);
      const lensPosts = await fetchPostsBatch(rootPostIds);
      // 3. Adapt and combine data
      const rootPostMap = new Map();
      lensPosts.forEach(post => {
        rootPostMap.set(post.id, post);
      });
      const threadPromises = dbThreads.map(async threadRecord => {
        const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) : null;
        if (!rootPost || !rootPost.author) return null;
        return await adaptFeedToThread(rootPost.author, threadRecord, rootPost);
      });
      const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];
      return { success: true, threads };
    }
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      threads: [],
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
}
