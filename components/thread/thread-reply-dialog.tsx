"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ThreadReplyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  replyingToUsername?: string;
  replyingToAvatar?: string;
  replyingToContent?: string;
}

export function ThreadReplyDialog({
  open,
  onClose,
  onSubmit,
  replyingToUsername,
  replyingToAvatar,
  replyingToContent,
}: ThreadReplyDialogProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      onClose();
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{replyingToUsername ? `Reply to @${replyingToUsername}` : "Add a Reply"}</DialogTitle>
          <DialogDescription>
            Your reply will appear in the thread chronologically, and {replyingToUsername || "the author"} will be
            notified.
          </DialogDescription>
        </DialogHeader>

        {/* Show context of what we're replying to */}
        {replyingToUsername && replyingToContent && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={replyingToAvatar} />
                <AvatarFallback className="text-xs">{replyingToUsername[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">@{replyingToUsername}</span>
            </div>
            <p className="line-clamp-3 text-sm text-muted-foreground">{replyingToContent}</p>
          </div>
        )}

        {/* Reply input */}
        <div className="space-y-2">
          <Textarea
            placeholder={
              replyingToUsername ? `@${replyingToUsername} will be mentioned automatically...` : "Write your reply..."
            }
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isSubmitting}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            {replyingToUsername && (
              <>
                <span className="font-medium text-green-600 dark:text-green-400">@{replyingToUsername}</span> will be
                added to your reply automatically
              </>
            )}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Reply"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
