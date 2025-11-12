-- Fix RLS Policies to Allow Anonymous Users to Insert Bookings
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;

-- Create new policies that allow anonymous users (for testing)
-- These policies allow both authenticated and anonymous users

-- Bookings Policies
-- Allow anyone to insert bookings (for testing - you can restrict later)
CREATE POLICY "Allow insert bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to view their own bookings (by user_id match)
CREATE POLICY "Allow view own bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true); -- For testing, allow viewing all. Change to: USING (auth.uid() = user_id OR user_id IS NOT NULL) for production

-- Allow users to update their own bookings
CREATE POLICY "Allow update own bookings"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true); -- For testing. Change to: USING (auth.uid() = user_id) for production

-- Allow users to delete their own bookings
CREATE POLICY "Allow delete own bookings"
  ON bookings FOR DELETE
  TO anon, authenticated
  USING (true); -- For testing. Change to: USING (auth.uid() = user_id) for production

-- Transactions Policies
-- Allow anyone to insert transactions (for testing)
CREATE POLICY "Allow insert transactions"
  ON transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to view their own transactions
CREATE POLICY "Allow view own transactions"
  ON transactions FOR SELECT
  TO anon, authenticated
  USING (true); -- For testing, allow viewing all. Change to: USING (auth.uid() = user_id OR user_id IS NOT NULL) for production

-- Allow users to update their own transactions
CREATE POLICY "Allow update own transactions"
  ON transactions FOR UPDATE
  TO anon, authenticated
  USING (true); -- For testing. Change to: USING (auth.uid() = user_id) for production









