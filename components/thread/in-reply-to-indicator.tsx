"use client";

import Link from "next/link";
import { CornerDownRight } from "lucide-react";

interface InReplyToIndicatorProps {
  username: string;
  postId?: string;
}

export function InReplyToIndicator({ username, postId }: InReplyToIndicatorProps) {
  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (postId) {
      const element = document.getElementById(postId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add highlight effect
        element.classList.add("bg-green-50/50", "dark:bg-green-900/20", "transition-colors", "duration-500");
        setTimeout(() => {
          element.classList.remove("bg-green-50/50", "dark:bg-green-900/20");
        }, 2000);
      }
    }
  };

  return (
    <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
      <CornerDownRight className="h-3 w-3" />
      <span>In reply to</span>
      <Link
        href={`/u/${username}`}
        className="font-medium text-green-600 hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
      >
        @{username}
      </Link>

      {postId && (
        <>
          <span>•</span>
          <button onClick={handleScroll} className="flex items-center gap-0.5 hover:text-foreground hover:underline">
            Show context
          </button>
        </>
      )}
    </div>
  );
}
