# Web3 Forum (Society Protocol)

A decentralized forum application built on Lens Protocol, designed to be a "Discourse for Web3".

## Overview

This application allows users to create and participate in token-gated communities (Lens Groups). It uses a hybrid architecture:

- **Lens Protocol**: Handles identity, posts, comments, and on-chain group membership/rules.
- **Supabase**: Handles indexing, "featured" community lists, and fast data retrieval.
- **Next.js**: The frontend framework.

## Prerequisites

- **Node.js** (v18+)
- **pnpm** (Recommended package manager)
- **Git**
- **Supabase Account** (Cloud recommended)
- **Wallet** (Metamask, Rainbow, etc.) with a Private Key for admin operations.

## Setup Guide

### 1. Clone & Install

```bash
git clone https://github.com/FritzDVL/LensForum2.git
cd LensForum2
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory. You can copy `.env.example` as a template, but ensure you use the correct variable names below.

**Important**: This app uses server-side variables for database connections. Do NOT use `NEXT_PUBLIC_` for sensitive keys like the Supabase URL or Private Key.

```env
# Supabase Configuration (Get these from your Supabase Project Settings -> API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Admin Wallet (Used for server-side operations/relaying)
PRIVATE_KEY=your-wallet-private-key

# WalletConnect (Get from cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Environment (mainnet or testnet)
NEXT_PUBLIC_LENSFORUM_ENV=mainnet
```

### 3. Database Setup (Supabase)

1.  Create a new project on [Supabase](https://supabase.com).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy and run the migration files located in `supabase/migrations/`. You must run them **in order** (by date/timestamp).
    - Start with `20250620100640_add_community_table.sql`
    - Continue through all files ending with `...add_title_summary_thread_table.sql`.
    - _Tip: You can copy content from multiple files and run them in batches._

### 4. Configure Communities

The app does not automatically show all Lens Groups. You must "feature" the ones you want to display.

1.  Create your Groups/Communities using any Lens Protocol interface (or a script).
2.  Get the **Group Address** (e.g., `0x123...`).
3.  In Supabase, go to the **Table Editor** -> `communities` table.
4.  Insert a new row for each community:
    - `lens_group_address`: Your Group Address
    - `name`: Community Name
    - `visible`: `TRUE`
    - `featured`: `1` (This makes it appear on the home page)
    - `feed`: `0x0000000000000000000000000000000000000000` (Placeholder if unknown)

### 5. Lens App Registration

1.  Register a Lens App (Profile) for your forum (e.g., "web3-forum").
2.  Update `lib/shared/constants.ts`:
    - `MAINNET_APP_ADDRESS`: Your App's address.
    - `APP_NAME`: Your App's name.

### 6. Run Locally

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture Notes

- **Main Page**: `app/page.tsx`
- **Styling**: Uses Tailwind CSS (`tailwind.config.ts`) and global variables (`app/globals.css`).
- **Data Fetching**:
  - `lib/services/`: Business logic and data aggregation.
  - `lib/external/`: Direct calls to Lens API or Supabase.
