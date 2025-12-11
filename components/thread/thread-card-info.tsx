"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ContentRenderer from "@/components/shared/content-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getThreadContent, getThreadTags, getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Clock } from "lucide-react";

interface ThreadCardInfoProps {
  thread: Thread;
  hideTitle?: boolean;
}

export function ThreadCardInfo({ thread, hideTitle }: ThreadCardInfoProps) {
  const [tags, setTags] = useState<string[]>([]);

  const isEdited = thread.rootPost?.isEdited;
  const { title, summary } = getThreadTitleAndSummary(thread.rootPost);

  // Extract thread content and image
  const { content, image, video } = getThreadContent(thread.rootPost);

  useEffect(() => {
    const doFetchTags = async () => {
      const result = await getThreadTags(thread.rootPost);
      setTags(result);
    };
    doFetchTags();
  }, [thread.rootPost]);

  return (
    <div className="space-y-4">
      {/* Title & Summary Section */}
      <div className="px-1">
        {!hideTitle && (
          <h1 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">{title}</h1>
        )}
        {summary && <p className="mt-1 max-w-2xl text-base text-gray-500 dark:text-gray-400">{summary}</p>}
      </div>

      {/* Author & Meta Info Row (moved below title) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-100 dark:border-gray-700">
            <AvatarImage src={thread.author.metadata?.picture || undefined} alt={thread.author.username?.value} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-sm font-bold text-white">
              {thread.author.username?.localName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              href={`/u/${thread.author.username?.localName}`}
              className="font-semibold text-foreground hover:underline"
            >
              {thread.author.username?.localName}
            </Link>
            <span className="text-xs text-muted-foreground">{getTimeAgo(new Date(thread.rootPost.timestamp))}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isEdited && (
            <span className="rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200">
              edited
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-2">
        <ContentRenderer
          content={{ content, image, video }}
          className="rich-text-content rounded-2xl p-0 text-foreground dark:text-gray-100"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1 pt-2">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
