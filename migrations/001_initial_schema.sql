-- Rovify Database Schema
-- PostgreSQL/Supabase compatible
-- Run this migration to set up your initial database structure

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    bio TEXT,
    image TEXT,
    auth_method TEXT NOT NULL CHECK (auth_method IN ('email', 'google', 'metamask', 'base')),
    is_organiser BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    password_hash TEXT, -- For email auth
    
    -- Social links
    twitter TEXT,
    instagram TEXT,
    website TEXT,
    
    -- Preferences
    preferences JSONB DEFAULT '{"notifications": true, "newsletter": true}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    
    -- Location data
    location JSONB NOT NULL, -- {name, address, city, coordinates: {lat, lng}}
    venue_capacity INTEGER,
    
    -- Organizer
    organiser_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Categorization
    category TEXT,
    subcategory TEXT,
    tags TEXT[],
    
    -- Pricing
    price JSONB, -- {min, max, currency, tiers: [{name, price, benefits}]}
    
    -- NFT/Blockchain
    has_nft_tickets BOOLEAN DEFAULT false,
    contract_address TEXT,
    contract_event_id INTEGER, -- On-chain event ID
    
    -- Ticket info
    total_tickets INTEGER,
    sold_tickets INTEGER DEFAULT 0,
    max_tickets_per_user INTEGER DEFAULT 10,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    
    -- Social metrics
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ============================================
-- TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ticket details
    type TEXT NOT NULL, -- VIP, GENERAL, EARLY_BIRD, etc.
    tier_name TEXT,
    price DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- NFT details
    is_nft BOOLEAN DEFAULT false,
    token_id TEXT UNIQUE,
    contract_address TEXT,
    transferable BOOLEAN DEFAULT true,
    
    -- Status
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'TRANSFERRED', 'CANCELLED')),
    
    -- Seat/slot info
    seat_info JSONB, -- {section, row, seat, timeSlot}
    
    -- Verification
    qr_code TEXT UNIQUE,
    verification_code TEXT UNIQUE,
    
    -- Metadata
    metadata JSONB, -- {issuer, edition, perks, originalPrice, etc.}
    
    -- Usage tracking
    used_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES users(id),
    
    -- Timestamps
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    
    -- Transaction details
    type TEXT NOT NULL CHECK (type IN ('purchase', 'transfer', 'refund', 'payout')),
    amount DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Payment method
    payment_method TEXT, -- stripe, crypto, etc.
    payment_id TEXT, -- Stripe payment ID or transaction hash
    
    -- Blockchain details
    transaction_hash TEXT,
    block_number INTEGER,
    gas_used TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ============================================
-- MESSAGES TABLE (for event chat)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'system')),
    
    -- Reply threading
    reply_to_id UUID REFERENCES messages(id),
    
    -- Status
    edited BOOLEAN DEFAULT false,
    deleted BOOLEAN DEFAULT false,
    
    -- Metadata
    metadata JSONB, -- {reactions, mentions, attachments}
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    
    -- Reference
    reference_type TEXT, -- event, ticket, message, etc.
    reference_id UUID,
    
    -- Status
    read BOOLEAN DEFAULT false,
    
    -- Action
    action_url TEXT,
    action_text TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- ============================================
-- FOLLOWS TABLE (user relationships)
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id)
);

-- ============================================
-- EVENT_ATTENDEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'attended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_organiser ON events(organiser_id);
CREATE INDEX idx_events_status ON events(status);

CREATE INDEX idx_tickets_owner ON tickets(owner_id);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_token ON tickets(token_id) WHERE token_id IS NOT NULL;

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_hash ON transactions(transaction_hash) WHERE transaction_hash IS NOT NULL;

CREATE INDEX idx_messages_event ON messages(event_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (for Supabase)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and update it
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Public can view published events
CREATE POLICY "Public can view published events" ON events
    FOR SELECT USING (status = 'published');

-- Organizers can manage their own events
CREATE POLICY "Organizers can manage own events" ON events
    FOR ALL USING (auth.uid()::text = organiser_id::text);

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (auth.uid()::text = owner_id::text);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can read messages from events they have tickets for
CREATE POLICY "Users can read event messages" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tickets 
            WHERE tickets.event_id = messages.event_id 
            AND tickets.owner_id::text = auth.uid()::text
        )
    );

-- Users can read their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert default categories
INSERT INTO events (id, title, description, category, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'System Event', 'System placeholder', 'SYSTEM', 'draft')
ON CONFLICT DO NOTHING;

-- Create admin user (update with your details)
-- INSERT INTO users (email, name, auth_method, is_admin)
-- VALUES ('admin@rovify.io', 'Admin', 'email', true)
-- ON CONFLICT DO NOTHING;
