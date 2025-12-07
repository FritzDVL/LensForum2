-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_address TEXT NOT NULL, -- Links to the Lens Group (Channel)
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel_address, slug)
);

-- Create Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_address TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel_address, slug)
);

-- Create Thread Classifications Table (Links Threads to Categories)
CREATE TABLE IF NOT EXISTS thread_categories (
    publication_id TEXT PRIMARY KEY, -- The Lens Post ID (e.g., "0x01-0x01")
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Thread Tags Table (Links Threads to Tags - Many-to-Many)
CREATE TABLE IF NOT EXISTS thread_tags (
    publication_id TEXT NOT NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (publication_id, tag_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_tags ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Authenticated Write)
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Public thread_categories are viewable by everyone" ON thread_categories FOR SELECT USING (true);
CREATE POLICY "Public thread_tags are viewable by everyone" ON thread_tags FOR SELECT USING (true);

-- Only authenticated users can insert (in a real app, you might restrict this to admins or specific logic)
CREATE POLICY "Authenticated users can insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert tags" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can classify threads" ON thread_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can tag threads" ON thread_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
