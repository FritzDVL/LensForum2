"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Tag } from "@/lib/domain/classification/types";
import { ChevronDown, Layers, Tag as TagIcon } from "lucide-react";

interface ThreadFiltersProps {
  categories: Category[];
  tags: Tag[];
}

export function ThreadFilters({ categories, tags }: ThreadFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategorySlug = searchParams.get("category");
  const currentTagSlug = searchParams.get("tag");

  const currentCategory = categories.find(c => c.slug === currentCategorySlug);
  const currentTag = tags.find(t => t.slug === currentTagSlug);

  const updateFilter = (type: "category" | "tag", value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Reset page when filtering
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-gray-800">
        <Button
          variant={!currentCategorySlug && !currentTagSlug ? "white" : "ghost"}
          size="sm"
          onClick={() => router.push("?")}
          className={`rounded-md px-3 text-sm font-medium ${!currentCategorySlug && !currentTagSlug ? "shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Latest
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Get the current path (e.g., /communities/0x123) and append /categories
            const path = window.location.pathname;
            router.push(`${path}/categories`);
          }}
          className="rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Categories
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-slate-200 bg-white px-3 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Layers className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span className="mr-2 text-xs">{currentCategory ? currentCategory.name : "All Categories"}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => updateFilter("category", null)}>All Categories</DropdownMenuItem>
            {categories.map(category => (
              <DropdownMenuItem key={category.id} onClick={() => updateFilter("category", category.slug)}>
                <div className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                  {category.name}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-slate-200 bg-white px-3 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <TagIcon className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span className="mr-2 text-xs">{currentTag ? currentTag.name : "All Tags"}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => updateFilter("tag", null)}>All Tags</DropdownMenuItem>
            {tags.map(tag => (
              <DropdownMenuItem key={tag.id} onClick={() => updateFilter("tag", tag.slug)}>
                {tag.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {(currentCategory || currentTag) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("?")}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
