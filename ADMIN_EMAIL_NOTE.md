# Admin Email Clarification

## Current Admin Email
The admin email is: **amit@ami-dar.co.il** (with hyphen in "ami-dar")

You mentioned: `amit@amidar.co.il` (without hyphen)

## If You Want to Change It

If you want to change the admin email from `amit@ami-dar.co.il` to `amit@amidar.co.il`, you have two options:

### Option 1: Update the Existing User's Email

Run this SQL in Supabase:

```sql
-- Update the email in auth.users
UPDATE auth.users 
SET email = 'amit@amidar.co.il', 
    raw_user_meta_data = jsonb_set(raw_user_meta_data, '{email}', '"amit@amidar.co.il"')
WHERE email = 'amit@ami-dar.co.il';

-- Update the email in public.users
UPDATE users 
SET email = 'amit@amidar.co.il' 
WHERE email = 'amit@ami-dar.co.il';
```

### Option 2: Create a New Admin User

Use the admin panel or run this SQL:

```sql
-- First, create the auth user manually in Supabase Dashboard
-- Auth > Users > Invite User
-- Email: amit@amidar.co.il
-- Then get the user ID and run:

INSERT INTO users (id, email, full_name, role)
VALUES ('[USER_ID_FROM_AUTH]', 'amit@amidar.co.il', 'Amit', 'admin');
```

### Option 3: Keep Both Admins

You can have multiple admin users. The current admin (amit@ami-dar.co.il) will continue to work, and you can add amit@amidar.co.il as an additional admin.

## Current Working Admin Credentials
- **Email**: amit@ami-dar.co.il
- **Password**: 123456
- **Role**: admin
- **User ID**: b6b43d8c-0073-48d2-8502-301513384c15

This admin can create messengers once the code is deployed to Vercel.

