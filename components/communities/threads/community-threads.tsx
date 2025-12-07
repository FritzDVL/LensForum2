"use client";

import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { CommunityThreadsList } from "@/components/communities/threads/community-threads-list";
import { ThreadFilters } from "@/components/communities/threads/thread-filters";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadsPaginated } from "@/hooks/threads/use-threads-paginated";
import { Category, Tag } from "@/lib/domain/classification/types";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

interface CommunityThreadsProps {
  community: Community;
  threads: Thread[];
  initialCrosspostEnabled: boolean;
  categories: Category[];
  tags: Tag[];
}

export function CommunityThreads({
  community,
  threads: initialThreads,
  initialCrosspostEnabled = false,
  categories,
  tags,
}: CommunityThreadsProps) {
  const { threads, loading, next, prev, hasNext, hasPrev } = useThreadsPaginated({
    community,
    initialThreads,
    initialCrosspostEnabled,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <CommunityNavActions community={community} />
        <CommunityHeader community={community} />

        <ThreadFilters categories={categories} tags={tags} />

        {loading ? (
          <div className="flex w-full items-center justify-center py-12">
            <LoadingSpinner text="Loading threads..." />
          </div>
        ) : (
          <CommunityThreadsList threads={threads} />
        )}
        <Pagination onPrev={prev} onNext={next} hasPrev={hasPrev} hasNext={hasNext} loading={loading} />
      </div>
    </main>
  );
}
