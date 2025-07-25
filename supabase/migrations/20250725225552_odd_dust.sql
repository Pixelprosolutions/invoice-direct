/*
  # Create Invoices Table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, not null)
      - `invoice_data` (jsonb, not null) - stores complete invoice information
      - `status` (text, default 'draft', check constraint)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for users to manage their own invoices only
    - Add check constraint for status values

  3. Performance
    - Add indexes for common queries
    - Add GIN index for JSONB invoice_data searches
*/

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  invoice_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices table
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at DESC);

-- GIN index for JSONB searches (e.g., searching by client name, invoice number)
CREATE INDEX IF NOT EXISTS invoices_data_gin_idx ON invoices USING GIN (invoice_data);

-- Specific indexes for common JSONB queries
CREATE INDEX IF NOT EXISTS invoices_client_name_idx ON invoices USING GIN ((invoice_data->>'clientName'));
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON invoices USING GIN ((invoice_data->>'invoiceNumber'));
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices USING GIN ((invoice_data->>'dueDate'));
