-- Add news_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS news_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  source TEXT,
  published_date DATE,
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 10),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_news_items_published_date ON news_items(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_relevance_score ON news_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_entity_id ON news_items(entity_id);

-- Enable RLS
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access to news_items" ON news_items
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage news_items" ON news_items
  FOR ALL USING (auth.role() = 'authenticated');
