import Image from "next/image";
import { CommunityHeaderActions } from "@/components/communities/display/community-header-actions";
import { CommunityRuleDetails } from "@/components/communities/rules/community-rule-details";
import { ThreadFilters } from "@/components/communities/threads/thread-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Category, Tag } from "@/lib/domain/classification/types";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { MessageCircle, Users } from "lucide-react";

interface CommunityHeaderProps {
  community: Community;
  categories: Category[];
  tags: Tag[];
}

export function CommunityHeader({ community, categories, tags }: CommunityHeaderProps) {
  if (!community) return null;

  return (
    <>
      <Card className="mb-6 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:gap-6">
            {/* Logo - Reduced size for text focus - Fixed position top-left */}
            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center pt-1">
              {community.group.metadata?.icon ? (
                <Image
                  src={groveLensUrlToHttp(community.group.metadata?.icon)}
                  alt={community.name}
                  width={56}
                  height={56}
                  className="h-[56px] w-[56px] rounded-full border border-slate-200 bg-white object-cover dark:border-gray-700"
                />
              ) : (
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-xl font-semibold text-white">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Main content wrapper */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {/* Top Row: Title/Desc + Actions */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <h1 className="mb-2 truncate text-2xl font-bold text-foreground md:text-3xl">{community.name}</h1>
                  <p className="mb-3 max-w-2xl whitespace-pre-line break-words text-muted-foreground">
                    {community.group.metadata?.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {community.memberCount.toLocaleString()} members
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {community.threadsCount} threads
                    </div>
                    <CommunityRuleDetails community={community} />
                  </div>
                </div>

                {/* Actions - Prevent obstruction by keeping in separate flex item */}
                <div className="shrink-0 md:ml-4">
                  <CommunityHeaderActions communityAddr={community.group.address} />
                </div>
              </div>

              {/* Bottom Row: Filters (moved here as requested) */}
              <div className="w-full pt-2">
                <ThreadFilters categories={categories} tags={tags} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
