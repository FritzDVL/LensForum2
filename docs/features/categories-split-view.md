# Feature Requirement Document (FRED): Categories Split View Layout

## 1. Feature Name

Discourse-Style Categories Split View

## 2. Goal

To redesign the "Categories" page of the application to mimic the clean, information-dense layout of Discourse (e.g., EthResearch). This involves moving from a single-stack card layout to a two-column split layout displaying "Categories" on the left and "Latest/Top Topics" on the right.

## 3. User Story

- As a **Visitor**, I want to see a high-level overview of all discussion categories and the most active recent topics on a single screen so that I can quickly quickly scan for interesting content without excessive scrolling.

## 4. Functional Requirements

### Layout

- [ ] **Two-Column Grid**: Implement a responsive grid layout.
  - **Left Column (Categories)**: ~40-50% width. Listing all categories.
  - **Right Column (Topics)**: ~50-60% width. Listing recent/top threads.
- [ ] **Mobile Responsiveness**: On mobile, stack these columns (Categories first, or tabs to switch).

### Left Column: Category List

- [ ] Display list of categories.
- [ ] Each category item must show:
  - Category Name (Bold).
  - Color Badge/Bar (Vertical strip or box).
  - Description (Subtle text).
  - _Optional_: Total Topic Count (if available efficiently).

### Right Column: Latest/Top Topics

- [ ] Display a list of threads (initially "Latest" threads across all categories, or "Top" if sorting is available).
- [ ] Each thread item must show:
  - Thread Title (Clean link, no card background).
  - Author Avatar (Small).
  - Reply Count.
  - Time elapsed (e.g., "10m", "3d").
  - Category Badge (Small pill indicating which category it belongs to).

### Navigation/Header

- [ ] Update the Sub-navigation tabs to match:
  - `Categories` (Active)
  - `Latest`
  - `Top` (Placeholder or functional)
  - `Bookmarks` (Placeholder)

## 5. Data Requirements

- **Aggregated Threads**: The "Right Column" needs to fetch a mixed list of threads from _all_ categories, not just 3 per category.
- **Category Stats**: Need to confirm if we can get `threads_count` per category easily. (Currently might need a DB helper).

## 6. User Flow

1.  User clicks "Categories" tab from the Home page.
2.  User sees the split view.
3.  User can click a Category on the left to filter the Right column to _only_ that category (or navigate to a category-specific page).
4.  User can click a Topic on the right to go to the thread.

## 7. Acceptance Criteria

- [ ] The page visually resembles the provided "EthResearch" screenshot.
- [ ] Categories are listed on the left.
- [ ] A global list of recent threads matches the "Latest/Top" list on the right.
- [ ] Dark mode is supported (using the user's existing specific palette).

## 8. Edge Cases

- **Empty State**: No categories or no threads.
- **Long Descriptions**: Truncate category descriptions if they break the layout.
- **Small Screens**: Ensure it doesn't look cramped on tablets.

## 9. Non-Functional Requirements

- **Performance**: The "Right Column" query should be efficient (pagination supported).
