import React from "react";
import { ThreadCardActions } from "@/components/thread/thread-card-actions";
import { ThreadCardInfo } from "@/components/thread/thread-card-info";
import { Card, CardContent } from "@/components/ui/card";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadCardProps {
  thread: Thread;
  community: Community;
  hideTitle?: boolean;
}

export function ThreadCard({ thread, community, hideTitle }: ThreadCardProps) {
  return (
    <>
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6">
          <ThreadCardInfo thread={thread} hideTitle={hideTitle} />
          <ThreadCardActions thread={thread} community={community} />
        </CardContent>
      </Card>
    </>
  );
}
