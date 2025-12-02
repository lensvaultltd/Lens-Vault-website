# Lens Vault - Database and Authentication Setup Guide

## Prerequisites

1. **Supabase Account**: https://supabase.com
2. **Firebase Account**: https://console.firebase.google.com
3. **Node.js** installed on your system

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project
- Go to https://supabase.com and sign in
- Your project is already created: `wcjjvzlqateivondlvph`
- Project URL: `https://wcjjvzlqateivondlvph.supabase.co`

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click **Run** to execute the schema
5. Verify tables are created by going to **Table Editor**

You should see three tables:
- `users`
- `payments`
- `contact_messages`

### 1.3 Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates for password reset

## Step 2: Set Up Firebase

### 2.1 Create Firebase Project
- Your project is already configured: `lens-vault`
- Project ID: `lens-vault`

### 2.2 Enable Authentication Providers
1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Add your support email
   - Save
3. Enable **Twitter** provider (optional):
   - Click on Twitter
   - Toggle "Enable"
   - Add API Key and API Secret from Twitter Developer Portal
   - Save

### 2.3 Configure Authorized Domains
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domain (e.g., `localhost` for development)
3. Add your production domain when deploying

## Step 3: Environment Configuration

### 3.1 Create .env.local File
The `.env.local` file is gitignored for security. Create it manually:

```bash
# Copy the example file
cp .env.example .env.local
```

### 3.2 Fill in Environment Variables
Your `.env.local` should contain:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://wcjjvzlqateivondlvph.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjamp2emxxYXRlaXZvbmRsdnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDkxNDAsImV4cCI6MjA4MDE4NTE0MH0.gNUpPes_sPsBQAX2uZM3GAziwxKfG1IS-wmHGYwZBmE

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAvt12Kw10yP-j8p4HDAUkRjl0kWe-S4Tw
VITE_FIREBASE_AUTH_DOMAIN=lens-vault.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lens-vault
VITE_FIREBASE_STORAGE_BUCKET=lens-vault.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=916649613172
VITE_FIREBASE_APP_ID=1:916649613172:web:b0cfec7b7fd292a5a37e21

# Paystack
VITE_PAYSTACK_PUBLIC_KEY=pk_live_1efccc2535b9269d6737dd0557277d25e1e37a92
```

## Step 4: Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `firebase` - Firebase SDK

## Step 5: Run the Application

```bash
npm run dev
```

The application should start on `http://localhost:3000`

## Step 6: Test Authentication

### Test Email/Password Signup
1. Navigate to the signup page
2. Enter name, email, and password
3. Click "Sign Up"
4. Verify user appears in Supabase Dashboard → Authentication → Users
5. Verify user record in Database → Table Editor → users

### Test Email/Password Login
1. Navigate to the login page
2. Enter the email and password you just created
3. Click "Login"
4. Verify successful login

### Test Social Login (Google)
1. Navigate to the login page
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Verify user is created in Supabase

### Test Wallet Authentication
1. Ensure MetaMask is installed
2. Navigate to the login page
3. Click "Connect Wallet to Login"
4. Approve MetaMask connection
5. Verify wallet address is stored in user profile

### Test Payment Integration
1. Login as a user
2. Navigate to pricing page
3. Select a plan and click "Pay Setup"
4. Complete Paystack payment (use test card if in test mode)
5. Verify payment record in Supabase → payments table
6. Verify user's plan is updated

### Test Contact Form
1. Navigate to contact page
2. Fill out the form
3. Submit
4. Verify message in Supabase → contact_messages table

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution**: Run `npm install` to install dependencies

### Issue: "Property 'env' does not exist on type 'ImportMeta'"
**Solution**: This is resolved by the Vite configuration. Make sure you have the latest vite.config.ts

### Issue: Firebase authentication not working
**Solution**: 
1. Check that you've enabled the authentication providers in Firebase Console
2. Verify your domain is in the authorized domains list
3. Check browser console for specific error messages

### Issue: Supabase RLS policies blocking requests
**Solution**: The schema includes RLS policies. If you're having issues:
1. Go to Supabase Dashboard → Authentication → Policies
2. Temporarily disable RLS for testing: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
3. Re-enable after testing

### Issue: Environment variables not loading
**Solution**:
1. Ensure `.env.local` file exists in the root directory
2. Restart the dev server after creating/modifying `.env.local`
3. Check that variable names start with `VITE_`

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to version control
- The Supabase anon key is safe to expose in client-side code
- Firebase config is also safe to expose (protected by Firebase security rules)
- Keep your Supabase service role key secret (not used in this implementation)

## Next Steps

1. **Configure Email Templates**: Customize Supabase email templates for password reset
2. **Set Up Production Environment**: Create production Firebase and Supabase projects
3. **Configure CORS**: If deploying to a custom domain, configure CORS in Supabase
4. **Add More Providers**: Enable additional social login providers (Facebook, GitHub, etc.)
5. **Implement Password Reset**: Add password reset functionality using Supabase auth
6. **Add Profile Management**: Create a user profile page for updating user information

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
