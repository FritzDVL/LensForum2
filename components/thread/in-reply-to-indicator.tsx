"use client";

import Link from "next/link";
import { CornerDownRight } from "lucide-react";

interface InReplyToIndicatorProps {
  username: string;
}

export function InReplyToIndicator({ username }: InReplyToIndicatorProps) {
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
    </div>
  );
}
