# Supabase Setup Guide for Invoice Direct

This guide will help you set up Supabase for your Invoice Direct MVP.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `invoice-direct`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## 3. Create Environment File

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Set Up Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

### Create Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  invoice_count INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Invoices Table
```sql
-- Create invoices table
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  invoice_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own invoices
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);
```

### Create Function to Increment Invoice Count
```sql
-- Create function to increment invoice count
CREATE OR REPLACE FUNCTION increment_invoice_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET invoice_count = invoice_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Create Trigger for Profile Creation
```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 5. Configure Authentication

1. Go to Authentication → Settings
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: `http://localhost:5173/**`
   - Enable email confirmations if desired
   - Set up email templates (optional)

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with a test email
3. Check the Supabase dashboard to see if:
   - User appears in Authentication → Users
   - Profile is created in Database → profiles table

## 7. Production Setup

When deploying to production:

1. Update Site URL and Redirect URLs in Supabase Auth settings
2. Update your `.env` file with production URLs
3. Consider enabling email confirmation for security

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check your environment variables are correct
2. **"Row Level Security"**: Make sure RLS policies are set up correctly
3. **"Function not found"**: Ensure all SQL commands were executed successfully

### Useful Supabase Dashboard Sections:

- **Authentication → Users**: See registered users
- **Database → Tables**: View your data
- **Database → Functions**: Check custom functions
- **API → Logs**: Debug API calls
- **Settings → API**: Get your credentials

## Next Steps

Once Supabase is set up:

1. Test user registration and login
2. Verify invoice creation and counting
3. Test the freemium limits
4. Set up Stripe integration for payments

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
