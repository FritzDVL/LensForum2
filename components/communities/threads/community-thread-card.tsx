import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { APP_NAME } from "@/lib/shared/constants";
import { getTimeAgo } from "@/lib/shared/utils";
import { MessageCircle } from "lucide-react";

interface CommunityThreadCardProps {
  thread: Thread;
}

export function CommunityThreadCard({ thread }: CommunityThreadCardProps) {
  const router = useRouter();
  const { title } = getThreadTitleAndSummary(thread.rootPost);

  return (
    <div
      key={thread.id}
      className={`group grid cursor-pointer grid-cols-1 gap-4 bg-white p-4 transition-all hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 sm:grid-cols-12 sm:items-center sm:px-6 sm:py-4 ${
        thread.rootPost.app && thread.rootPost.app.metadata?.name !== APP_NAME
          ? "bg-orange-50/50 dark:bg-orange-900/5"
          : ""
      }`}
      onClick={() => {
        router.push(`/thread/${thread.slug}`);
      }}
    >
      {/* Thread Info Column (Mobile: Full width, Desktop: 7 cols) */}
      <div className="col-span-1 min-w-0 sm:col-span-7">
        <div className="flex items-start gap-3">
          {/* Avatar - Only for desktop/larger screens logic in grid but flex mostly */}
          <div className="hidden shrink-0 sm:block">
            {thread.author ? (
              <Link
                href={`/u/${thread.author.username?.localName}`}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={thread.author.metadata?.picture || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs font-medium text-white">
                    {thread.author.username?.localName?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-slate-200 text-xs dark:bg-gray-700">??</AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-base font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {title}
            </h3>

            {/* Mobile Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 sm:hidden">
              <span className="text-xs text-muted-foreground">{getTimeAgo(new Date(thread.created_at))}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="flex items-center text-xs text-muted-foreground">
                <MessageCircle className="mr-1 h-3 w-3" />
                {thread.repliesCount}
              </span>
            </div>

            {/* Desktop Tags/Author Metadata - Showing Author Name explicitly */}
            {thread.author && (
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Link
                  href={`/u/${thread.author.username?.localName}`}
                  className="hover:text-foreground"
                  onClick={e => e.stopPropagation()}
                >
                  {thread.author.username?.localName || thread.author.address.slice(0, 8)}
                </Link>
                {thread.rootPost.app && thread.rootPost.app.metadata?.name !== APP_NAME && (
                  <span className="rounded-sm bg-orange-100 px-1 py-0.5 text-[10px] uppercase text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    {thread.rootPost.app.metadata?.name || "External"}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replies Column */}
      <div className="col-span-2 hidden text-center text-sm font-medium text-muted-foreground sm:block">
        {thread.repliesCount}
      </div>

      {/* Views Column - Placeholder for now as Views not on Thread type yet */}
      <div className="col-span-1 hidden text-center text-sm text-muted-foreground sm:block">-</div>

      {/* Activity Column */}
      <div className="col-span-2 hidden text-right text-sm text-muted-foreground sm:block">
        {getTimeAgo(new Date(thread.created_at))}
      </div>
    </div>
  );
}
