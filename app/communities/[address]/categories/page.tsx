import Link from "next/link";
import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { StatusBanner } from "@/components/shared/status-banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategories } from "@/lib/services/classification/get-categories";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { APP_NAME } from "@/lib/shared/constants";
import { getTimeAgo } from "@/lib/shared/utils";
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

  const categoriesPromise = getCategories(community.group.address);
  const latestThreadsPromise = getCommunityThreads(community, {
    limit: 20,
    showAllPosts: false, // Ensure we get Supabase threads with proper metadata
  });

  const [categories, latestThreadsResult] = await Promise.all([categoriesPromise, latestThreadsPromise]);
  const latestThreads = latestThreadsResult.success ? latestThreadsResult.threads : [];

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <CommunityNavActions community={community} />
        <CommunityHeader community={community} categories={categories} tags={[]} />

        <div className="mt-8 grid gap-12 md:grid-cols-[45%_55%] lg:grid-cols-[40%_60%]">
          {/* Left Column: Categories */}
          <section aria-label="Categories">
            <div className="mb-4 flex items-center justify-between border-b pb-2 dark:border-gray-700">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Category</h2>
              <span className="text-xs text-muted-foreground">TOPICS</span>
            </div>

            <div className="space-y-1">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="group flex items-start justify-between py-3 pr-2 transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/50"
                  style={{ borderLeft: `3px solid ${category.color}` }}
                >
                  <div className="pl-3">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      <Link href={`/communities/${community.group.address}?category=${category.slug}`}>
                        {category.name}
                      </Link>
                    </h3>
                    {category.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                  {/* Placeholder for thread count if we add it to DB later */}
                  {/* <span className="text-sm font-medium text-muted-foreground">142</span> */}
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Latest Topics */}
          <section aria-label="Latest Topics">
            <div className="mb-4 flex items-center justify-between border-b pb-2 dark:border-gray-700">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Latest</h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-gray-800">
              {latestThreads.length > 0 ? (
                latestThreads.map(thread => {
                  const isExternal = thread.rootPost.app && thread.rootPost.app.metadata?.name !== APP_NAME;

                  return (
                    <div key={thread.id} className="flex items-start gap-3 py-3">
                      {/* Author Avatar */}
                      <Link href={`/u/${thread.author.username?.localName}`} className="hidden shrink-0 sm:block">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={thread.author.metadata?.picture || ""} />
                          <AvatarFallback className="bg-slate-200 text-xs dark:bg-gray-700">
                            {thread.author.username?.localName?.slice(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link href={`/thread/${thread.slug}`} className="group block">
                          <h4 className="line-clamp-2 text-[15px] font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
                            {thread.title || "Untitled Thread"}
                          </h4>
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          {/* Mobile Author (if avatar hidden) */}
                          <span className="font-semibold text-foreground sm:hidden">
                            {thread.author.username?.localName}
                          </span>

                          {isExternal && (
                            <span className="rounded-sm bg-orange-100 px-1 py-0.5 text-[10px] uppercase text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                              External
                            </span>
                          )}

                          <span>{getTimeAgo(new Date(thread.created_at))}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {thread.repliesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No recent topics found.</div>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link
                href={`/communities/${community.group.address}`}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                View all topics →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
