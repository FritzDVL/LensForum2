import { CommunityHeaderActions } from "@/components/communities/display/community-header-actions";
import { CommunityRuleDetails } from "@/components/communities/rules/community-rule-details";
import { ThreadFilters } from "@/components/communities/threads/thread-filters";
import { Category, Tag } from "@/lib/domain/classification/types";
import { Community } from "@/lib/domain/communities/types";

interface CommunityHeaderProps {
  community: Community;
  categories: Category[];
  tags: Tag[];
}

export function CommunityHeader({ community, categories, tags }: CommunityHeaderProps) {
  if (!community) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{community.name}</h1>
          <p className="mt-2 max-w-3xl text-lg text-muted-foreground">{community.group.metadata?.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span>{community.memberCount.toLocaleString()} members</span>
            <span>{community.threadsCount} threads</span>
            <CommunityRuleDetails community={community} />
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <CommunityHeaderActions communityAddr={community.group.address} />
        </div>
      </div>

      <div className="mt-8 border-b border-border pb-1">
        <ThreadFilters categories={categories} tags={tags} />
      </div>
    </div>
  );
}
