-- TakeCharge Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users or your users table
  booking_id VARCHAR(50) UNIQUE NOT NULL, -- Human-readable booking ID (e.g., TC-2024-001)
  
  -- Station Information
  station_id VARCHAR(100) NOT NULL,
  station_name VARCHAR(255) NOT NULL,
  station_address TEXT,
  station_image TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Charging Details
  slot_id VARCHAR(100),
  connector_type VARCHAR(50), -- e.g., 'CCS Type 1', 'CCS Type 2', 'CHAdeMO', 'Tesla Supercharger'
  charging_speed VARCHAR(50), -- e.g., '150 kW', '250 kW'
  
  -- Schedule
  scheduled_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER, -- Actual charging duration after completion
  
  -- Pricing
  rate_per_kwh DECIMAL(10, 4) NOT NULL,
  charging_cost DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  taxes DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) NOT NULL,
  actual_total_cost DECIMAL(10, 2), -- Actual cost after completion
  
  -- Charging Data (filled after completion)
  energy_delivered_kwh DECIMAL(10, 2),
  
  -- Payment
  payment_method VARCHAR(50), -- e.g., 'Credit Card', 'UPI', 'Digital Wallet'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'active', 'completed', 'cancelled'
  
  -- QR Code
  qr_code TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Transaction Details
  transaction_type VARCHAR(20) NOT NULL, -- 'payment', 'refund', 'adjustment'
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment Information
  payment_method VARCHAR(50), -- e.g., 'Credit Card', 'UPI', 'Digital Wallet'
  payment_provider VARCHAR(50), -- e.g., 'stripe', 'paypal', 'razorpay', 'upi'
  payment_provider_transaction_id VARCHAR(255), -- External payment provider transaction ID
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Additional Information
  description TEXT,
  metadata JSONB, -- Store additional data like payment gateway response, etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_station_id ON bookings(station_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_id ON transactions(payment_provider_transaction_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Bookings Policies
-- Users can only see their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bookings (optional - you may want to soft delete instead)
CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions Policies
-- Users can only see their own transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own transactions
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking ID
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
  padded_num TEXT;
BEGIN
  IF NEW.booking_id IS NULL OR NEW.booking_id = '' THEN
    -- Get the next number in sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id FROM '[0-9]+$') AS INTEGER)), 0) + 1 
    INTO next_num
    FROM bookings 
    WHERE booking_id LIKE 'TC-' || TO_CHAR(NOW(), 'YYYY') || '-%';
    
    -- Pad the number with zeros to 3 digits
    padded_num := TO_CHAR(next_num, 'FM000');
    
    -- Generate booking ID
    NEW.booking_id := 'TC-' || TO_CHAR(NOW(), 'YYYY') || '-' || padded_num;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate booking_id
CREATE TRIGGER generate_booking_id_trigger BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_id();

