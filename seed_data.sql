-- Seed data for Amidar Messenger System
-- This script creates demo data for testing the messenger management system

-- Insert demo users
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES 
  -- Messenger user
  ('11111111-1111-1111-1111-111111111111', 'messenger@example.com', 'יוסי כהן', '050-1234567', 'messenger', NOW(), NOW()),
  
  -- Member/Donor users
  ('22222222-2222-2222-2222-222222222222', 'donor1@example.com', 'דוד לוי', '050-2345678', 'member', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'donor2@example.com', 'שרה אברהם', '050-3456789', 'member', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'donor3@example.com', 'מרים יצחק', '050-4567890', 'member', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'donor4@example.com', 'אברהם משה', '050-5678901', 'member', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'donor5@example.com', 'רחל יעקב', '050-6789012', 'member', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert messenger
INSERT INTO messengers (
  id, 
  user_id, 
  plan_type, 
  landing_page_slug, 
  wallet_balance, 
  is_active,
  custom_goal_text,
  symbol,
  commission_rate_one_time,
  commission_rate_monthly,
  created_at,
  updated_at
)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '18',
  'yossi-cohen',
  1580.00,
  true,
  'להצלחת כל עם ישראל ולרפואת החולים',
  '🙏',
  16.67,
  16.67,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert members (donors)
INSERT INTO members (
  id,
  user_id,
  messenger_id,
  subscription_type,
  subscription_status,
  next_payment_date,
  hebrew_birth_date,
  years_of_blessing,
  created_at,
  updated_at
)
VALUES 
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'monthly',
    'active',
    NOW() + INTERVAL '30 days',
    'ט״ו בשבט תשמ״ג',
    '120',
    NOW() - INTERVAL '90 days',
    NOW()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'monthly',
    'active',
    NOW() + INTERVAL '25 days',
    'כ״ה באדר תשנ״ה',
    '120',
    NOW() - INTERVAL '60 days',
    NOW()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'one_time',
    'active',
    NULL,
    'י״ח בניסן תשס״ב',
    '120',
    NOW() - INTERVAL '45 days',
    NOW()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '55555555-5555-5555-5555-555555555555',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'monthly',
    'active',
    NOW() + INTERVAL '15 days',
    'ה׳ בסיון תשמ״ח',
    '120',
    NOW() - INTERVAL '30 days',
    NOW()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '66666666-6666-6666-6666-666666666666',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'monthly',
    'cancelled',
    NULL,
    'כ״ג בתמוז תשנ״ט',
    '120',
    NOW() - INTERVAL '120 days',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Insert prayer requests
INSERT INTO prayer_requests (
  id,
  member_id,
  messenger_id,
  prayer_subject_name,
  prayer_intention,
  status,
  submitted_at
)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'דוד בן שרה',
    'לרפואה שלמה',
    'active',
    NOW() - INTERVAL '2 days'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'רחל בת מרים',
    'למציאת זיווג הגון',
    'active',
    NOW() - INTERVAL '5 days'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'משה בן אברהם',
    'להצלחה בעסקים',
    'active',
    NOW() - INTERVAL '1 day'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'שרה בת רבקה',
    'לזרע של קיימא',
    'active',
    NOW() - INTERVAL '3 days'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'יעקב בן לאה',
    'לרפואה שלמה',
    'completed',
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert transactions (commissions earned)
INSERT INTO transactions (
  id,
  type,
  amount,
  currency,
  status,
  user_id,
  related_member_id,
  related_messenger_id,
  description,
  created_at
)
VALUES 
  -- Monthly subscription commissions (5 ILS each)
  (
    '20000000-0000-0000-0000-000000000001',
    'messenger_commission',
    5.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה ממנוי חודשי - דוד לוי',
    NOW() - INTERVAL '60 days'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'messenger_commission',
    5.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה ממנוי חודשי - שרה אברהם',
    NOW() - INTERVAL '30 days'
  ),
  -- One-time payment commission (60 ILS)
  (
    '20000000-0000-0000-0000-000000000003',
    'messenger_commission',
    60.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה מתשלום חד-פעמי - מרים יצחק',
    NOW() - INTERVAL '45 days'
  ),
  -- More monthly commissions
  (
    '20000000-0000-0000-0000-000000000004',
    'messenger_commission',
    5.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה ממנוי חודשי - אברהם משה',
    NOW() - INTERVAL '15 days'
  ),
  -- Multiple months of commissions
  (
    '20000000-0000-0000-0000-000000000005',
    'messenger_commission',
    5.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה ממנוי חודשי - דוד לוי (חודש 2)',
    NOW() - INTERVAL '30 days'
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'messenger_commission',
    5.00,
    'ILS',
    'completed',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'עמלה ממנוי חודשי - דוד לוי (חודש 3)',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- Update messenger wallet balance based on transactions
UPDATE messengers 
SET wallet_balance = (
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE related_messenger_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    AND type = 'messenger_commission'
    AND status = 'completed'
)
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Verify the data
SELECT 'Users created:' as info, COUNT(*) as count FROM users WHERE role IN ('messenger', 'member');
SELECT 'Messengers created:' as info, COUNT(*) as count FROM messengers;
SELECT 'Members created:' as info, COUNT(*) as count FROM members;
SELECT 'Prayer requests created:' as info, COUNT(*) as count FROM prayer_requests;
SELECT 'Transactions created:' as info, COUNT(*) as count FROM transactions;
SELECT 'Messenger wallet balance:' as info, wallet_balance FROM messengers WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

