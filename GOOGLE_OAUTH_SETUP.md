# Google OAuth Setup Guide for Invoice Direct

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it: `invoice-direct-oauth`

### 1.2 Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - **App name**: `Invoice Direct`
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **App domain**: `https://your-domain.com` (or leave blank for now)
   - **Authorized domains**: Add `supabase.co`

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name it: `Invoice Direct Web Client`
5. Add Authorized redirect URIs:
   ```
   https://hlaqgqerwmegiyhzitse.supabase.co/auth/v1/callback
   ```
6. Click "Create"
7. **SAVE** the Client ID and Client Secret

## Step 2: Supabase Configuration

### 2.1 Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click to configure
4. Toggle "Enable sign in with Google" to ON
5. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Click "Save"

### 2.2 Update Redirect URLs
1. In "Authentication" → "Settings"
2. Add to "Redirect URLs":
   ```
   https://your-production-domain.com/**
   http://localhost:5173/**
   ```

## Step 3: Test Configuration

### 3.1 Test in Development
1. Restart your development server
2. Try Google Sign-In
3. Check Supabase dashboard for new users

### 3.2 Common Issues
- **"redirect_uri_mismatch"**: Check redirect URIs in Google Console
- **"invalid_client"**: Verify Client ID/Secret in Supabase
- **"access_blocked"**: Add your email to test users in Google Console

## Step 4: Production Setup

When deploying to production:
1. Update Google Console redirect URIs with production domain
2. Update Supabase redirect URLs with production domain
3. Test the complete flow

## Security Notes
- Keep Client Secret secure
- Only add trusted domains to redirect URIs
- Review OAuth consent screen before publishing
