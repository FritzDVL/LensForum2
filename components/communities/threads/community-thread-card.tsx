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
      {/* Thread Info Column (Mobile: Full width, Desktop: 6 cols) */}
      <div className="col-span-1 min-w-0 sm:col-span-6">
        <div className="flex flex-col gap-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-relaxed text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {title}
            </h3>

            {/* Desktop Tags/Category Metadata */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              {thread.classification?.category && (
                <div className="flex items-center gap-1">
                  <span
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ backgroundColor: thread.classification.category.color }}
                  />
                  <span className="font-medium text-muted-foreground">{thread.classification.category.name}</span>
                </div>
              )}
              {thread.classification?.tags?.map(tag => (
                <span key={tag.id} className="text-muted-foreground/80 hover:text-foreground">
                  {tag.name}
                </span>
              ))}

              {/* Mobile Metadata Row (only visible on mobile) */}
              <div className="mt-1 flex items-center gap-2 text-muted-foreground sm:hidden">
                <span>{getTimeAgo(new Date(thread.created_at))}</span>
                <span>•</span>
                <span className="flex items-center">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {thread.repliesCount}
                </span>
                <span>•</span>
                <span>{thread.author?.username?.localName || "User"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posters Column (Desktop only) */}
      <div className="hidden sm:col-span-1 sm:flex sm:items-center sm:justify-center">
        {thread.author ? (
          <Link
            href={`/u/${thread.author.username?.localName}`}
            className="transition-opacity hover:opacity-80"
            onClick={e => e.stopPropagation()}
            title={thread.author.username?.localName || "Author"}
          >
            <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all hover:ring-brand-500/20">
              <AvatarImage src={thread.author.metadata?.picture || ""} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-[10px] font-bold text-white">
                {thread.author.username?.localName?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="h-8 w-8 opacity-50">
            <AvatarFallback>??</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Replies Column */}
      <div className="col-span-2 hidden items-center justify-center text-sm font-medium text-muted-foreground sm:flex">
        {thread.repliesCount}
      </div>

      {/* Views Column */}
      <div className="col-span-1 hidden items-center justify-center text-sm text-muted-foreground sm:flex">-</div>

      {/* Activity Column */}
      <div className="col-span-2 hidden items-center justify-end text-sm text-muted-foreground sm:flex">
        <span className="font-medium text-brand-600 dark:text-brand-400">
          {getTimeAgo(new Date(thread.updatedAt || thread.created_at))}
        </span>
      </div>
    </div>
  );
}
