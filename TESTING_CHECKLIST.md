# Database Migration & Testing Checklist

## 🗄️ Database Migration (REQUIRED)

Run this SQL in Supabase SQL Editor:
- [ ] Execute `supabase/migrate_to_supabase_auth.sql`
- [ ] Verify `auth_id` column added to users table
- [ ] Verify RLS policies are created
- [ ] Enable real-time replication in Dashboard

## 🔐 Supabase Dashboard Configuration

### Authentication Providers
- [ ] **Google OAuth**:
  - Enable in Authentication → Providers
  - Add Client ID & Secret
  - Note redirect URL: `https://uslsivbowljschhckpsg.supabase.co/auth/v1/callback`
  
- [ ] **Twitter OAuth**:
  - Enable in Authentication → Providers
  - Add API Key & Secret

### Real-time Configuration
- [ ] Go to Database → Replication
- [ ] Enable publication for:
  - `users`
  - `bookings`
  - `payments`
  - `security_stats`

## ⚙️ Environment Variables

### Local (.env.local) - ✅ CONFIGURED
```
VITE_SUPABASE_URL=https://uslsivbowljschhckpsg.supabase.co
VITE_SUPABASE_ANON_KEY=***
VITE_PAYSTACK_PUBLIC_KEY=***
```

### Vercel (Production) - ⚠️ NEEDS VERIFICATION
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_PAYSTACK_PUBLIC_KEY`

## 🧪 Frontend Testing

### Authentication Tests
- [ ] **Email Signup**
  - Try creating a new account
  - Verify user in Supabase Auth → Users
  - Verify profile in Database → users table
  - Check `auth_id` is populated

- [ ] **Email Login**
  - Sign in with created account
  - Verify session persists after refresh
  - Check localStorage has session

- [ ] **Google OAuth**
  - Click "Sign in with Google"
  - Complete OAuth flow
  - Verify user created in both places
  - Check profile sync

- [ ] **Password Reset**
  - Request password reset
  - Check email received
  - Complete reset flow

- [ ] **Session Persistence**
  - Login and refresh page
  - Verify still logged in
  - Check auth state in React DevTools

### Real-time Tests
- [ ] **Profile Updates**
  - Update user profile
  - Verify changes reflected immediately
  - Check network tab for websocket connection

- [ ] **Bookings**
  - Create a booking
  - Verify appears in bookings list
  - Update booking status
  - Verify real-time update

### UI/UX Tests
- [ ] **Luxurious Animations**
  - Hero section floating orbs working
  - Service cards 3D tilt on mouse move
  - Premium buttons magnetic hover
  - Smooth page transitions

- [ ] **Responsive Design**
  - Test on mobile viewport
  - Test on tablet viewport
  - Test on desktop
  - Verify all animations work smoothly

## 🔍 Backend Verification

### Database Queries
- [ ] Test user table queries
- [ ] Test RLS policies (users can only see own data)
- [ ] Test foreign key constraints
- [ ] Test cascade deletes

### API Integration
- [ ] Paystack payment flow
- [ ] Contact form submission
- [ ] Feedback submission
- [ ] Booking creation

## 🚨 Known Issues to Fix

1. **Database Schema**: Old schema still references Firebase UID (text)
   - ✅ Created migration script
   - ⏳ Needs to be executed in Supabase

2. **RLS Policies**: Currently too permissive
   - ✅ Created secure policies in migration
   - ⏳ Needs to be applied

3. **OAuth Providers**: Not configured yet
   - ⏳ Needs Google/Twitter setup in Dashboard

## ✅ Verification Commands

```bash
# Check dev server is running
curl http://localhost:5173

# Check environment variables
cat .env.local | grep VITE_

# Check build works
npm run build

# Test TypeScript compilation
npx tsc --noEmit
```

## 📊 Success Criteria

- [ ] All tests pass
- [ ] No console errors
- [ ] Auth flows work end-to-end
- [ ] Real-time updates visible
- [ ] Responsive on all devices
- [ ] Animations smooth at 60fps
- [ ] Build time < 30s
- [ ] Bundle size < 400 kB gzipped
