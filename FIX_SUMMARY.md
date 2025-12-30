# Admin RLS Fix - Create Messenger Issue

## Problem
The admin user (amit@amidar.co.il) was unable to create new messengers. The error was:
```
Error creating messenger: AuthApiError: User not allowed
```

## Root Cause
The `useAdminMessengers` hook was trying to use `supabase.auth.admin.inviteUserByEmail()` directly from the client side. This API requires the **service role key**, but the client was initialized with the **anon key** for security reasons.

Using the service role key on the client side would be a **major security vulnerability** as it would expose full database access to anyone inspecting the browser's network requests.

## Solution
Created a secure Edge Function called `create-messenger` that:

1. **Verifies JWT authentication** - ensures the request comes from an authenticated user
2. **Checks admin role** - verifies the user has admin privileges
3. **Uses service role key securely** - only on the server side (Edge Function)
4. **Creates the messenger** - handles all three steps:
   - Creates auth user via `admin.inviteUserByEmail()`
   - Creates user record in `users` table
   - Creates messenger record in `messengers` table

## Changes Made

### 1. Created Edge Function: `create-messenger`
- **Location**: Deployed to Supabase Edge Functions
- **Security**: JWT verification enabled, admin role check implemented
- **Purpose**: Securely handle messenger creation with service role privileges

### 2. Updated Hook: `src/hooks/useAdminMessengers.ts`
- **Changed**: `createMessenger` function
- **Before**: Used `supabase.auth.admin.inviteUserByEmail()` directly (insecure)
- **After**: Calls the `create-messenger` Edge Function via `supabase.functions.invoke()`

## Testing Instructions

1. **Login as admin**: Use amit@ami-dar.co.il (password: 123456)
2. **Navigate to**: Admin > Messengers page
3. **Click**: "צור שליח חדש" (Create New Messenger) button
4. **Fill in the form**:
   - Full Name: Test Messenger (required)
   - Email: test-messenger@example.com (optional)
   - Phone: 0501234567 (required)
   - Plan Type: 18 or 30
   - Landing Page Slug: test-messenger (must be unique)
   - Commission rates: 15 (both fields)
5. **Submit**: Click the submit button
6. **Expected Result**: 
   - Success message appears
   - New messenger appears in the list
   - If email provided: Invitation email sent to the messenger
   - If no email: Messenger created without auth credentials (can be added later)

## Security Notes

✅ **Secure**: Service role key is only used on the server side (Edge Function)
✅ **Authenticated**: JWT verification ensures only logged-in users can call the function
✅ **Authorized**: Admin role check ensures only admins can create messengers
✅ **CORS Enabled**: Allows the frontend to call the Edge Function

## Additional Information

### Edge Function URL
The function is available at:
```
https://[your-project-ref].supabase.co/functions/v1/create-messenger
```

### RLS Status
- `users` table: RLS disabled (no policies needed)
- `messengers` table: RLS disabled (no policies needed)
- `landing_page_content` table: RLS enabled with proper policies

This is correct because the Edge Function uses the service role key which bypasses RLS, and the client-side operations don't need admin privileges.

## Next Steps

If you need to create similar admin operations (update messenger, delete messenger, etc.), follow the same pattern:
1. Create an Edge Function with admin verification
2. Update the hook to call the Edge Function
3. Never expose service role operations to the client side

