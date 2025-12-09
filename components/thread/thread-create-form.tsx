"use client";

import { TextEditor } from "@/components/editor/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useThreadCreateForm } from "@/hooks/forms/use-thread-create-form";
import { Category, Tag } from "@/lib/domain/classification/types";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ThreadCreateFormProps {
  community: Community;
  categories: Category[];
  tags: Tag[];
}

export function ThreadCreateForm({ community, categories, tags }: ThreadCreateFormProps) {
  const { account } = useAuthStore();
  const { formData, setFormData, handleChange, handleSubmit, isCreating } = useThreadCreateForm({
    community,
    author: account?.address || "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData = { ...formData };
    setFormData(newFormData);
    handleSubmit(e, newFormData);
  };

  return (
    <Card className="rounded-3xl border border-brand-200/60 bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <h1 className="text-2xl font-medium text-foreground">Create New Thread</h1>
        <p className="text-muted-foreground">Share your thoughts with the community</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleChange("title", e.target.value)}
              placeholder="What's your thread about?"
              required
            />
          </div>
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium text-foreground">
              Summary
            </Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={e => handleChange("summary", e.target.value)}
              placeholder="Brief description (max 100 chars)"
              maxLength={100}
            />
          </div>
          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-foreground">
              Content
            </Label>

            <Tabs defaultValue="visual" className="w-full">
              <div className="flex items-center justify-between pb-2">
                <TabsList className="grid w-64 grid-cols-3 bg-slate-100 dark:bg-gray-800">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visual" className="mt-0">
                <div className="rounded-2xl border border-brand-200/40 bg-white/50 backdrop-blur-sm dark:bg-gray-800">
                  <TextEditor initialValue={formData.content} onChange={value => handleChange("content", value)} />
                </div>
              </TabsContent>

              <TabsContent value="markdown" className="mt-0">
                <Textarea
                  value={formData.content}
                  onChange={e => handleChange("content", e.target.value)}
                  placeholder="Write in markdown..."
                  className="min-h-[300px] w-full rounded-2xl border-brand-200/40 bg-white/50 font-mono text-sm backdrop-blur-sm focus:ring-brand-500/20 dark:bg-gray-800"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="prose min-h-[300px] w-full max-w-none rounded-2xl border border-border bg-white px-8 py-6 dark:prose-invert dark:bg-gray-800">
                  <ReactMarkdown>{formData.content || "*Nothing to preview*"}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map(category => (
                <div
                  key={category.id}
                  onClick={() => handleChange("categoryId", category.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    formData.categoryId === category.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20"
                      : "border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  {category.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = formData.tagIds?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      const currentTags = formData.tagIds || [];
                      const newTags = isSelected ? currentTags.filter(id => id !== tag.id) : [...currentTags, tag.id];
                      // Also update the legacy tags string for Lens metadata
                      const selectedTagNames = tags
                        .filter(t => newTags.includes(t.id))
                        .map(t => t.name)
                        .join(",");

                      setFormData({ ...formData, tagIds: newTags, tags: selectedTagNames });
                    }}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
              className="rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Publishing...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Thread
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
