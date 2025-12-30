# Deployment Steps for Admin RLS Fix

## What Was Fixed
The admin user couldn't create new messengers due to trying to use admin API methods from the client side. This has been fixed by creating a secure Edge Function.

## Changes Made

### 1. Edge Function Created ✅
- **Name**: `create-messenger`
- **Status**: ACTIVE and deployed
- **Location**: Supabase Edge Functions
- **Security**: JWT verification enabled, admin role check implemented

### 2. Code Updated ✅
- **File**: `src/hooks/useAdminMessengers.ts`
- **Change**: Updated `createMessenger` function to call the Edge Function instead of using admin API directly

## Deployment Required

The code changes need to be deployed to Vercel for the production site to use the new Edge Function approach.

### Option 1: Deploy via Git (Recommended)
```bash
# Commit the changes
git add src/hooks/useAdminMessengers.ts
git commit -m "Fix: Use Edge Function for messenger creation to resolve admin RLS issue"
git push origin main

# Vercel will automatically deploy the changes
```

### Option 2: Manual Deployment
```bash
# Build and deploy manually
npm run build
# Then deploy the dist folder to Vercel
```

## Testing After Deployment

1. **Login as admin**
   - Email: `amit@ami-dar.co.il`
   - Password: `123456`

2. **Navigate to Messengers Page**
   - Go to: https://amidar.vercel.app/admin/messengers

3. **Create a New Messenger**
   - Click "צור שליח חדש" (Create New Messenger)
   - Fill in the form:
     - Email: test@example.com
     - Full Name: Test User
     - Phone: 0501234567
     - Plan Type: 18 or 30
     - Landing Page Slug: test-user-123 (must be unique)
     - Commission Rate (One-time): 15
     - Commission Rate (Monthly): 15
   - Submit the form

4. **Expected Results**
   - ✅ Success message appears
   - ✅ New messenger appears in the list
   - ✅ Invitation email sent to the messenger
   - ✅ No "User not allowed" error in console

## Verification Checklist

- [ ] Code deployed to Vercel
- [ ] Login as admin works
- [ ] Can access admin/messengers page
- [ ] Can open "Create Messenger" modal
- [ ] Can submit the form without errors
- [ ] New messenger appears in the list
- [ ] No console errors

## Troubleshooting

### If you still see "User not allowed" error:
1. Check browser console for the exact error
2. Verify the Edge Function is being called (check Network tab)
3. Check Edge Function logs: `supabase functions logs create-messenger`
4. Ensure you're logged in as admin (amit@ami-dar.co.il)

### If Edge Function returns an error:
1. Check the response body in Network tab
2. Verify the admin user has role='admin' in the database
3. Check Edge Function logs for detailed error messages

## Current Admin User
- **Email**: amit@ami-dar.co.il
- **Role**: admin
- **User ID**: b6b43d8c-0073-48d2-8502-301513384c15

## Edge Function Details
- **Function Name**: create-messenger
- **Version**: 1
- **Status**: ACTIVE
- **JWT Verification**: Enabled
- **Created**: 2025-12-30

## Security Notes
✅ Service role key is only used server-side in the Edge Function
✅ JWT verification ensures only authenticated users can call the function
✅ Admin role check ensures only admins can create messengers
✅ No sensitive credentials exposed to the client

