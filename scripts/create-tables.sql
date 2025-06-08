-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create entities table
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('social_enterprise', 'investor', 'ecosystem_builder')),
    website TEXT NOT NULL,
    description TEXT NOT NULL,
    hq_location TEXT,
    contact_email TEXT,
    industry_sector TEXT,
    social_status TEXT,
    funding_stage TEXT,
    cheque_size_range TEXT,
    investment_thesis TEXT,
    program_type TEXT,
    next_intake_date TEXT,
    impact TEXT,
    problem_solved TEXT,
    target_beneficiaries TEXT,
    revenue_model TEXT,
    year_founded TEXT,
    awards TEXT,
    grants TEXT,
    institutional_support TEXT,
    claim_status TEXT DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'pending', 'claimed')),
    approved BOOLEAN DEFAULT false,
    last_enriched TIMESTAMP WITH TIME ZONE
);

-- Create news_items table
CREATE TABLE news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    published_date TIMESTAMP WITH TIME ZONE
);

-- Create intro_requests table
CREATE TABLE intro_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    requester_email TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create update_logs table
CREATE TABLE update_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action TEXT NOT NULL CHECK (action IN ('update', 'news_refresh', 'approve', 'reject')),
    details TEXT NOT NULL,
    duration TEXT NOT NULL,
    user_id UUID
);

-- Create indexes for better performance
CREATE INDEX idx_entities_entity_type ON entities(entity_type);
CREATE INDEX idx_entities_approved ON entities(approved);
CREATE INDEX idx_entities_claim_status ON entities(claim_status);
CREATE INDEX idx_entities_slug ON entities(slug);
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_industry_sector ON entities(industry_sector);
CREATE INDEX idx_entities_hq_location ON entities(hq_location);

CREATE INDEX idx_news_items_entity_id ON news_items(entity_id);
CREATE INDEX idx_news_items_published_date ON news_items(published_date);

CREATE INDEX idx_intro_requests_entity_id ON intro_requests(entity_id);
CREATE INDEX idx_intro_requests_status ON intro_requests(status);

CREATE INDEX idx_update_logs_created_at ON update_logs(created_at);
CREATE INDEX idx_update_logs_action ON update_logs(action);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_entities_updated_at 
    BEFORE UPDATE ON entities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO entities (
    name, 
    slug, 
    entity_type, 
    website, 
    description, 
    hq_location, 
    contact_email, 
    industry_sector, 
    funding_stage, 
    approved,
    claim_status,
    impact,
    problem_solved,
    target_beneficiaries,
    revenue_model,
    year_founded
) VALUES 
(
    'EcoCycle Berhad',
    'ecocycle-berhad',
    'social_enterprise',
    'https://example.com/ecocycle',
    'EcoCycle is a social enterprise focused on recycling and waste management solutions in urban areas.',
    'Kuala Lumpur',
    'info@ecocycle.example.com',
    'Waste Management, Environment',
    'Seed',
    true,
    'claimed',
    'Diverted 500 tons of waste from landfills, created 50 green jobs',
    'Urban waste management and environmental pollution',
    'Urban communities, waste collectors',
    'Service fees, product sales',
    '2019'
),
(
    'PichaEats',
    'pichaeats',
    'social_enterprise',
    'https://example.com/pichaeats',
    'PichaEats empowers refugee chefs to build livelihoods through a food delivery service.',
    'Kuala Lumpur',
    'hello@pichaeats.example.com',
    'Food, Social Impact',
    'Growth',
    true,
    'claimed',
    'Supported 25 refugee families, delivered 10,000+ meals',
    'Refugee unemployment and food access',
    'Refugees, food lovers',
    'Commission on orders, catering services',
    '2020'
),
(
    'Impact Ventures Malaysia',
    'impact-ventures-malaysia',
    'investor',
    'https://example.com/impact-ventures',
    'Impact Ventures Malaysia is an early-stage impact investor focusing on social enterprises in Southeast Asia.',
    'Kuala Lumpur',
    'invest@impactventures.example.com',
    'Impact Investing, Financial Inclusion',
    null,
    true,
    'claimed',
    'Invested in 15 social enterprises, created 200+ jobs',
    'Lack of funding for early-stage social enterprises',
    'Social entrepreneurs, impact startups',
    'Investment returns, management fees',
    '2018'
),
(
    'Social Innovation Hub',
    'social-innovation-hub',
    'ecosystem_builder',
    'https://example.com/sihub',
    'Social Innovation Hub is an accelerator for social enterprises addressing Malaysia''s most pressing challenges.',
    'Penang',
    'hello@sihub.example.com',
    'Education, Technology',
    null,
    true,
    'claimed',
    'Accelerated 30 social enterprises, raised RM2M in funding',
    'Lack of support for early-stage social entrepreneurs',
    'Social entrepreneurs, impact startups',
    'Program fees, equity stakes',
    '2017'
),
(
    'Biji-Biji Initiative',
    'biji-biji-initiative',
    'social_enterprise',
    'https://example.com/biji-biji',
    'Biji-Biji Initiative is a sustainable design company that upcycles waste materials into furniture and art.',
    'Selangor',
    'hello@biji-biji.example.com',
    'Sustainable Design, Waste Management',
    'Growth',
    true,
    'claimed',
    'Upcycled 2 tons of waste, created 15 artisan jobs',
    'Waste pollution and lack of sustainable design options',
    'Environmentally conscious consumers, businesses',
    'Product sales, design services',
    '2016'
);

-- Insert sample news items
INSERT INTO news_items (entity_id, title, url, source, published_date) VALUES
((SELECT id FROM entities WHERE slug = 'ecocycle-berhad'), 'EcoCycle Expands Recycling Operations', 'https://example.com/news/ecocycle-expansion', 'The Star', '2023-08-01'),
((SELECT id FROM entities WHERE slug = 'ecocycle-berhad'), 'EcoCycle Wins Environmental Award', 'https://example.com/news/ecocycle-award', 'New Straits Times', '2023-07-15'),
((SELECT id FROM entities WHERE slug = 'pichaeats'), 'PichaEats Launches New Catering Service', 'https://example.com/news/pichaeats-catering', 'The Edge', '2023-08-05'),
((SELECT id FROM entities WHERE slug = 'impact-ventures-malaysia'), 'Impact Ventures Closes New Fund', 'https://example.com/news/impact-ventures-fund', 'Tech in Asia', '2023-07-20');

-- Enable Row Level Security (RLS)
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to approved entities
CREATE POLICY "Public entities are viewable by everyone" ON entities
    FOR SELECT USING (approved = true);

-- Create policies for news items (public read)
CREATE POLICY "News items are viewable by everyone" ON news_items
    FOR SELECT USING (true);

-- Create policies for intro requests (allow insert for everyone)
CREATE POLICY "Anyone can submit intro requests" ON intro_requests
    FOR INSERT WITH CHECK (true);

-- Create policies for update logs (public read)
CREATE POLICY "Update logs are viewable by everyone" ON update_logs
    FOR SELECT USING (true);

-- Grant permissions for anonymous users
GRANT SELECT ON entities TO anon;
GRANT SELECT ON news_items TO anon;
GRANT INSERT ON intro_requests TO anon;
GRANT SELECT ON update_logs TO anon;

-- Grant permissions for authenticated users
GRANT ALL ON entities TO authenticated;
GRANT ALL ON news_items TO authenticated;
GRANT ALL ON intro_requests TO authenticated;
GRANT ALL ON update_logs TO authenticated;
