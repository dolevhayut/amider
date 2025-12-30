# Quick Start: Testing the Admin RLS Fix

## ✅ What's Been Done

1. **Edge Function Created**: `create-messenger` - ACTIVE and deployed to Supabase
2. **Code Updated**: `src/hooks/useAdminMessengers.ts` - Now calls the Edge Function
3. **Security Fixed**: Admin operations now happen server-side, not client-side

## 🚀 Next Steps to Test

### Step 1: Deploy the Code Changes

The code changes are ready but need to be deployed to Vercel:

```bash
cd /Users/dolevhayut/Documents/GitHub/amidar

# Stage the changes
git add src/hooks/useAdminMessengers.ts

# Commit
git commit -m "Fix: Use Edge Function for messenger creation (resolves admin RLS issue)"

# Push to trigger Vercel deployment
git push origin main
```

### Step 2: Wait for Vercel Deployment

- Vercel will automatically detect the push and deploy
- Wait for the deployment to complete (usually 1-2 minutes)
- You can check deployment status at: https://vercel.com/dashboard

### Step 3: Test the Fix

1. **Go to**: https://amidar.vercel.app
2. **Login with admin credentials**:
   - Email: `amit@ami-dar.co.il`
   - Password: `123456`
3. **Navigate to**: Admin > Messengers
4. **Click**: "צור שליח חדש" (Create New Messenger)
5. **Fill in the form**:
   - Full Name: `Test Messenger` (required)
   - Email: `test-messenger@example.com` (optional - leave empty if not needed)
   - Phone: `0501234567` (required)
   - Plan Type: `18`
   - Landing Page Slug: `test-messenger-123` (must be unique)
   - Commission Rate (One-time): `15`
   - Commission Rate (Monthly): `15`
6. **Submit** the form
7. **Expected**: Success! New messenger appears in the list

## 🔍 Verification

### Check Console (F12)
You should see:
- ✅ No "User not allowed" errors
- ✅ Successful function invocation
- ✅ "fetchMessengers completed successfully"

### Check Network Tab
Look for:
- ✅ POST request to `/functions/v1/create-messenger`
- ✅ Status: 200 OK
- ✅ Response: `{"success": true, "data": {...}}`

### Check Database
The new messenger should appear in:
- `auth.users` table (with auth credentials)
- `public.users` table (with role='messenger')
- `public.messengers` table (with messenger details)

## 📝 Files Changed

- `src/hooks/useAdminMessengers.ts` - Updated to use Edge Function
- Edge Function `create-messenger` - Deployed to Supabase

## 🔒 Security Improvements

**Before**: 
- ❌ Tried to use admin API from client (insecure, doesn't work)
- ❌ Would expose service role key if implemented

**After**:
- ✅ Admin operations happen in Edge Function (secure)
- ✅ Service role key stays server-side
- ✅ JWT verification ensures authenticated users only
- ✅ Admin role check ensures authorization

## 🐛 Troubleshooting

### If deployment fails:
```bash
# Check git status
git status

# Check if there are conflicts
git pull origin main

# Try pushing again
git push origin main
```

### If the error persists after deployment:
1. Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear browser cache
3. Check browser console for new error messages
4. Check Edge Function logs in Supabase dashboard

### If Edge Function fails:
```bash
# Check Edge Function logs
supabase functions logs create-messenger

# Or check in Supabase Dashboard:
# Edge Functions > create-messenger > Logs
```

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check the Network tab for the API call
3. Check Edge Function logs in Supabase
4. Share the error message for further assistance

## ✨ Summary

The fix is complete and ready to deploy. Once you push the code to Git, Vercel will automatically deploy it, and the admin will be able to create messengers without any "User not allowed" errors.

