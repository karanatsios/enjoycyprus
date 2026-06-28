-- Push Notifications System for Inside Cyprus
-- Run this in Supabase SQL Editor

-- Enable PostGIS for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Push subscriptions (one per browser/device per user)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification credits per business
CREATE TABLE IF NOT EXISTS notification_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credits INT NOT NULL DEFAULT 0,
  total_purchased INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification campaigns created by businesses
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  action_url TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  radius_km INT NOT NULL DEFAULT 10,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | sent | expired | cancelled
  credits_used INT NOT NULL DEFAULT 1,
  recipients_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit purchases (order history)
CREATE TABLE IF NOT EXISTS credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL,  -- starter | basic | pro | business | unlimited
  credits INT NOT NULL,
  amount_eur NUMERIC(8,2) NOT NULL,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own credits" ON notification_credits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins see all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users see own purchases" ON credit_purchases
  FOR ALL USING (auth.uid() = user_id);

-- Function: get users in radius (for edge function to call)
CREATE OR REPLACE FUNCTION get_subscriptions_in_radius(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION
)
RETURNS TABLE (endpoint TEXT, p256dh TEXT, auth TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT endpoint, p256dh, auth
  FROM push_subscriptions
  WHERE ST_DWithin(
    location::geography,
    ST_MakePoint(center_lng, center_lat)::geography,
    radius_km * 1000
  );
$$;
