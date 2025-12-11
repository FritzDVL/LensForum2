"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinCommunityAnnouncement } from "@/components/thread/join-community-announcement";
import { ThreadActions } from "@/components/thread/thread-actions";
import { ThreadCard } from "@/components/thread/thread-card";
import { ThreadRepliesList } from "@/components/thread/thread-replies-list";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/lib/domain/communities/types";
import { Thread as ThreadType } from "@/lib/domain/threads/types";
import { useQueryClient } from "@tanstack/react-query";

interface ThreadProps {
  community: Community;
  thread: ThreadType;
}

export function Thread({ community, thread }: ThreadProps) {
  const [isJoinLoading, setIsJoinLoading] = useState(false);

  const { isMember, updateIsMember, isLoading } = useCommunityMembership(community.group.address);
  const join = useJoinCommunity(community);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleJoin = async () => {
    setIsJoinLoading(true);
    const status = await join();
    if (status) {
      updateIsMember(true);
      // Invalidate thread-replies query so replies list refetches
      queryClient.invalidateQueries({ queryKey: ["thread-replies", thread.id] });
      router.refresh();
    }
    setIsJoinLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Community Announcement (if not member) */}
      {!isMember && !isLoading && (
        <div className="mb-6">
          <JoinCommunityAnnouncement isLoading={isJoinLoading} onJoinCommunity={handleJoin} />
        </div>
      )}

      {/* Top Actions */}
      <ThreadActions thread={thread} />

      {/* Main Title - Extracted from card for hierarchy */}
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">{thread.title}</h1>

      {/* Main Post Card (Title enabled inside as well per request) */}
      <ThreadCard thread={thread} community={community} hideTitle={false} />

      {/* Flattened Replies List */}
      <ThreadRepliesList thread={thread} community={community} />
    </div>
  );
}
