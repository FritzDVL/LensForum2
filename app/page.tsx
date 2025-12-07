import { CommunitiesList } from "@/components/communities/list/communities-list";
import { HeroSection } from "@/components/home/hero-section";
import { ThreadsSwitcher } from "@/components/home/threads-switcher";
import { getCommunitiesPaginated } from "@/lib/services/community/get-communities-paginated";
import { getFeaturedThreads } from "@/lib/services/thread/get-featured-threads";
import { getLatestThreads } from "@/lib/services/thread/get-latest-threads";
import { COMMUNITIES_PER_PAGE } from "@/lib/shared/constants";

export default async function HomePage() {
  const latestThreadsResult = await getLatestThreads(5);
  const latestThreads = latestThreadsResult.success ? (latestThreadsResult.threads ?? []) : [];

  const featuredThreadsResult = await getFeaturedThreads(5);
  const featuredThreads = featuredThreadsResult.success ? (featuredThreadsResult.threads ?? []) : [];

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

          {/* Threads Section */}
          <div className="w-full">
            <ThreadsSwitcher featuredThreads={featuredThreads} latestThreads={latestThreads} />
          </div>
        </div>
      </div>
    </>
  );
}
