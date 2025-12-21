import type { Database } from './database.types';

// Helper types from Supabase
export type User = Database['public']['Tables']['users']['Row'];
export type Messenger = Database['public']['Tables']['messengers']['Row'];
export type Member = Database['public']['Tables']['members']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type TefillinStand = Database['public']['Tables']['tefillin_stands']['Row'];

// Enums
export type UserRole = Database['public']['Enums']['user_role'];
export type SubscriptionType = Database['public']['Enums']['subscription_type'];
export type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
export type PlanType = Database['public']['Enums']['plan_type'];
export type PrayerStatus = Database['public']['Enums']['prayer_status'];
export type TransactionType = Database['public']['Enums']['transaction_type'];
export type TransactionStatus = Database['public']['Enums']['transaction_status'];

// Extended types with joins
export interface MessengerWithDetails extends Messenger {
  user: User;
  goal?: Goal;
  members?: Member[];
  memberCount?: number;
  activeSubsCount?: number;
}

export interface MemberWithDetails extends Member {
  user: User;
  messenger: Messenger;
  messengerUser?: User;
}

export interface PrayerRequestWithDetails extends PrayerRequest {
  member: Member;
  memberUser: User;
}

// Dashboard stats types
export interface MessengerStats {
  totalMembers: number;
  activeSubscriptions: number;
  totalEarned: number;
  walletBalance: number;
  activePrayers: number;
}

export interface MemberStats {
  subscriptionStatus: SubscriptionStatus;
  totalPaid: number;
  nextPaymentDate: string | null;
  activePrayers: number;
}

export interface AdminStats {
  totalMessengers: number;
  totalMembers: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  totalPrayers: number;
}

// Form types
export interface MessengerSignupForm {
  fullName: string;
  email: string;
  phone: string;
  planType: PlanType;
  goalId?: string;
  customGoalText?: string;
  tzadikImageUrl?: string;
  symbol?: string;
}

export interface MemberSignupForm {
  fullName: string;
  email: string;
  phone: string;
  subscriptionType: SubscriptionType;
  yearsOfBlessing: string;
}

export interface PrayerRequestForm {
  prayerSubjectName: string;
  prayerIntention: string;
}

