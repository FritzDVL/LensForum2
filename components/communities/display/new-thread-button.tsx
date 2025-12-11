import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Community } from "@/lib/domain/communities/types";
import { PenTool } from "lucide-react";

export function NewThreadButton({ community }: { community: Community }) {
  const router = useRouter();

  const canPost = community.group.feed?.operations?.canPost.__typename === "FeedOperationValidationPassed";
  if (!canPost) return null;

  return (
    <Button
      onClick={() => {
        router.push(`/communities/${community.group.address}/new-thread`);
      }}
      variant="default"
      size="sm"
      className="h-9 bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700"
    >
      New Thread
    </Button>
  );
}
