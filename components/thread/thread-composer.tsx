"use client";

import { useState } from "react";
import { TextEditor } from "@/components/editor/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CornerDownRight, X } from "lucide-react";

interface ThreadComposerProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  replyingToUsername?: string;
  replyingToAvatar?: string;
  replyingToContent?: string;
  placeholder?: string;
}

export function ThreadComposer({
  onSubmit,
  onCancel,
  replyingToUsername,
  replyingToAvatar,
  replyingToContent,
  placeholder = "Write your reply...",
}: ThreadComposerProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky bottom-0 z-10 border-t-2 border-green-500 bg-white shadow-lg dark:bg-gray-800">
      <CardContent className="p-4">
        {/* Header with reply context */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {replyingToUsername ? (
              <>
                <CornerDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">
                  Replying to <span className="text-green-600 dark:text-green-400">@{replyingToUsername}</span>
                </span>
              </>
            ) : (
              <span className="text-sm font-medium">Write a reply</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Context preview if replying to someone */}
        {replyingToUsername && replyingToContent && (
          <div className="mb-4 rounded-lg border border-border bg-muted/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={replyingToAvatar} />
                <AvatarFallback className="text-xs">{replyingToUsername[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">@{replyingToUsername}</span>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">{replyingToContent}</p>
          </div>
        )}

        {/* Rich Text Editor */}
        <div className="mb-4">
          <TextEditor
            onChange={setContent}
            initialValue={replyingToUsername && !content ? `@${replyingToUsername} ` : content || ""}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {replyingToUsername && (
              <>
                <span className="font-medium text-green-600 dark:text-green-400">@{replyingToUsername}</span> will be
                notified
              </>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
