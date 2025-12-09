"use client";

import { useMemo, useState } from "react";
import { CommunityThreadCard } from "@/components/communities/threads/community-thread-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { MessageCircle, Search } from "lucide-react";

export function CommunityThreadsList({ threads }: { threads: Thread[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const loading = false;

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const query = searchQuery.toLowerCase();
    return threads.filter(t => {
      const { title, summary } = getThreadTitleAndSummary(t.rootPost);
      return (title && title.toLowerCase().includes(query)) || (summary && summary.toLowerCase().includes(query));
    });
  }, [threads, searchQuery]);

  return (
    <Card className="overflow-hidden rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="border-b border-slate-100 pb-0 dark:border-gray-700">
        <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="flex items-center text-2xl font-bold text-foreground">
            <MessageCircle className="mr-3 h-6 w-6 text-brand-500" />
            Threads
          </h2>
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-xl bg-slate-50 py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-900 dark:focus:bg-gray-800"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="hidden grid-cols-12 gap-4 px-2 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
          <div className="col-span-7 pl-2">Topic</div>
          <div className="col-span-2 text-center">Replies</div>
          <div className="col-span-1 text-center">Views</div>
          <div className="col-span-2 pr-2 text-right">Activity</div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading threads..." />
          </div>
        ) : filteredThreads.length === 0 ? (
          <StatusBanner
            type="info"
            title="No threads yet"
            message="Be the first to start a thread in this community!"
            icon={<MessageCircle className="h-10 w-10 text-slate-400" />}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-gray-700">
            {filteredThreads.map(thread => (
              <CommunityThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
