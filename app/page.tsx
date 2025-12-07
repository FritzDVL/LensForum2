import { CommunitiesList } from "@/components/communities/list/communities-list";
import { HeroSection } from "@/components/home/hero-section";
import { getCommunitiesPaginated } from "@/lib/services/community/get-communities-paginated";
import { COMMUNITIES_PER_PAGE } from "@/lib/shared/constants";

export default async function HomePage() {
  // Fetch initial paginated communities (channels) for the main list
  const communitiesResult = await getCommunitiesPaginated({
    sort: { by: "memberCount", order: "desc" },
    limit: COMMUNITIES_PER_PAGE,
  });
  const initialCommunities = communitiesResult.success ? (communitiesResult.communities ?? []) : [];

  return (
    <>
      <HeroSection />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* All Channels Section (Main Feature) */}
          <div className="w-full">
            <CommunitiesList initialCommunities={initialCommunities} />
          </div>
        </div>
      </div>
    </>
  );
}
