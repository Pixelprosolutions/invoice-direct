/*
  # Create Database Functions

  1. Functions
    - `increment_invoice_count` - Safely increment user's invoice count
    - `get_user_invoice_stats` - Get comprehensive invoice statistics
    - `check_invoice_limits` - Check if user can create more invoices
    - `update_invoice_status` - Update invoice status with validation

  2. Security
    - All functions use SECURITY DEFINER for proper permissions
    - Input validation and error handling
    - Proper transaction handling
*/

-- Function to increment invoice count
CREATE OR REPLACE FUNCTION increment_invoice_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET invoice_count = invoice_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Verify the update happened
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user invoice statistics
CREATE OR REPLACE FUNCTION get_user_invoice_stats(user_id UUID)
RETURNS TABLE(
  total_invoices BIGINT,
  draft_invoices BIGINT,
  sent_invoices BIGINT,
  paid_invoices BIGINT,
  overdue_invoices BIGINT,
  total_amount NUMERIC,
  paid_amount NUMERIC,
  pending_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_invoices,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_invoices,
    COUNT(*) FILTER (WHERE status = 'sent') as sent_invoices,
    COUNT(*) FILTER (WHERE status = 'paid') as paid_invoices,
    COUNT(*) FILTER (WHERE status = 'overdue') as overdue_invoices,
    COALESCE(SUM((invoice_data->>'total')::NUMERIC), 0) as total_amount,
    COALESCE(SUM((invoice_data->>'total')::NUMERIC) FILTER (WHERE status = 'paid'), 0) as paid_amount,
    COALESCE(SUM((invoice_data->>'total')::NUMERIC) FILTER (WHERE status IN ('draft', 'sent', 'overdue')), 0) as pending_amount
  FROM invoices 
  WHERE invoices.user_id = get_user_invoice_stats.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create more invoices
CREATE OR REPLACE FUNCTION check_invoice_limits(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  current_count INTEGER;
BEGIN
  SELECT plan, invoice_count 
  INTO user_plan, current_count
  FROM profiles 
  WHERE id = user_id;
  
  -- If no profile found, allow creation (will be created by trigger)
  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;
  
  -- Premium users have unlimited invoices
  IF user_plan = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- Free users are limited to 3 invoices
  RETURN current_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update invoice status with validation
CREATE OR REPLACE FUNCTION update_invoice_status(
  invoice_id UUID,
  new_status TEXT,
  user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate status
  IF new_status NOT IN ('draft', 'sent', 'paid', 'overdue', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;
  
  -- Update the invoice
  UPDATE invoices 
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = invoice_id AND invoices.user_id = update_invoice_status.user_id;
  
  -- Return whether the update was successful
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old draft invoices (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM invoices 
  WHERE status = 'draft' 
    AND created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
