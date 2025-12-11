import { Button } from "@/components/ui/button";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { LogOut } from "lucide-react";

interface LeaveCommunityButtonProps {
  community: Community;
  onDialogOpen: (open: boolean) => void;
}

export function LeaveCommunityButton({ community, onDialogOpen }: LeaveCommunityButtonProps) {
  const { isLoggedIn } = useAuthStore();

  const handleOpenLeaveDialog = () => {
    onDialogOpen(true);
  };

  const canLeave = community?.group?.operations?.canLeave.__typename === "GroupOperationValidationPassed";
  if (!canLeave) {
    return null;
  }

  return (
    <Button
      disabled={!isLoggedIn}
      onClick={handleOpenLeaveDialog}
      size="sm"
      variant="outline"
      className="h-9 px-4 text-sm font-medium"
    >
      Leave
    </Button>
  );
}
