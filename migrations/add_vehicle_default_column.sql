-- Add is_default column to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Ensure user_notifications table exists
CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fuel_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  maintenance_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add any missing columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS plate TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model TEXT DEFAULT '';

-- Add missing column to fuel_records table
ALTER TABLE fuel_records ADD COLUMN IF NOT EXISTS station_location TEXT;

-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';