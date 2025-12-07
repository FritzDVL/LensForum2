import Link from "next/link";
import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { StatusBanner } from "@/components/shared/status-banner";
import { Category } from "@/lib/domain/classification/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCategories } from "@/lib/services/classification/get-categories";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { Address } from "@/types/common";
import { MessageCircle } from "lucide-react";

export default async function CategoriesPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress as Address);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return (
      <div className="flex min-h-screen items-start justify-center">
        <div className="w-full max-w-md px-4 pt-12">
          <StatusBanner
            type="info"
            title="Channel not found"
            message="The requested channel does not exist or could not be loaded."
          />
        </div>
      </div>
    );
  }

  const categories = await getCategories(community.group.address);

  // Fetch top threads for each category (limit 3 per category)
  const categoriesWithThreads: { category: Category; threads: Thread[] }[] = await Promise.all(
    categories.map(async category => {
      const result = await getCommunityThreads(community, {
        limit: 3,
        categorySlug: category.slug,
        showAllPosts: false,
      });
      return {
        category,
        threads: result.success ? (result.threads ?? []) : [],
      };
    }),
  );

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <CommunityNavActions community={community} />
        <CommunityHeader community={community} />

        <div className="mt-8 space-y-8">
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>

          <div className="grid gap-6">
            {categoriesWithThreads.map(({ category, threads }) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                      <h3 className="text-lg font-bold text-foreground">
                        <Link
                          href={`/communities/${community.group.address}?category=${category.slug}`}
                          className="hover:underline"
                        >
                          {category.name}
                        </Link>
                      </h3>
                    </div>
                    <span className="text-sm text-muted-foreground">{threads.length} recent topics</span>
                  </div>
                  {category.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-gray-700">
                  {threads.length > 0 ? (
                    threads.map(thread => (
                      <div
                        key={thread.id}
                        className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/30"
                      >
                        <div className="min-w-0 flex-1 pr-4">
                          <Link href={`/thread/${thread.slug}`} className="block">
                            <h4 className="truncate font-medium text-foreground hover:text-brand-600 dark:hover:text-brand-400">
                              {thread.title}
                            </h4>
                          </Link>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>by {thread.author.handle?.localName || thread.author.id.slice(0, 8)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4" />
                          <span>{thread.repliesCount}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No topics in this category yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
