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

// Admin - Messenger Management Types
export interface MessengerWithStats {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  landing_page_slug: string;
  plan_type: PlanType;
  wallet_balance: number;
  commission_rate_one_time: number;
  commission_rate_monthly: number;
  is_active: boolean;
  created_at: string;
  custom_goal_text: string | null;
  symbol: string | null;
  // Stats
  total_donors: number;
  active_subscriptions: number;
  total_revenue: number;
  this_month_revenue: number;
}

export interface CreateMessengerData {
  full_name: string;
  email?: string;
  phone: string;
  plan_type?: PlanType; // Will default to '18' in backend if not provided
  landing_page_slug: string;
  commission_rate_one_time: number;
  commission_rate_monthly: number;
  custom_goal_text?: string;
  symbol?: string; // Will be uploaded to bucket in the future
  bank_name?: string;
  bank_branch?: string;
  bank_account?: string;
  bank_account_holder?: string;
}

export interface UpdateMessengerData {
  full_name?: string;
  phone?: string;
  plan_type?: PlanType;
  landing_page_slug?: string;
  commission_rate_one_time?: number;
  commission_rate_monthly?: number;
  custom_goal_text?: string;
  symbol?: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account?: string;
  bank_account_holder?: string;
  is_active?: boolean;
}

export interface AdminMessengersStats {
  total_messengers: number;
  active_messengers: number;
  total_donors: number;
  this_month_revenue: number;
  total_commissions_paid: number;
}

// Landing Page Types
export interface ImpactItem {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  content: string;
  avatar?: string;
  role?: string;
}

export interface CustomSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery';
  title?: string;
  content: string;
  order: number;
}

export interface LandingPageContent {
  id: string;
  messenger_id: string;
  
  // Hero Section
  hero_title: string;
  hero_subtitle?: string;
  hero_description: string;
  hero_image_url?: string;
  
  // Call to Action
  cta_primary_text: string;
  cta_secondary_text?: string;
  
  // About Section
  about_title: string;
  about_content?: string;
  
  // Impact Section
  impact_title: string;
  impact_items: ImpactItem[];
  
  // Testimonials
  testimonials: Testimonial[];
  
  // Custom Sections
  custom_sections: CustomSection[];
  
  // Design Settings
  theme_color: string;
  background_style: 'light' | 'dark';
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface UpdateLandingPageContent {
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
  hero_image_url?: string;
  cta_primary_text?: string;
  cta_secondary_text?: string;
  about_title?: string;
  about_content?: string;
  impact_title?: string;
  impact_items?: ImpactItem[];
  testimonials?: Testimonial[];
  custom_sections?: CustomSection[];
  theme_color?: string;
  background_style?: 'light' | 'dark';
  meta_title?: string;
  meta_description?: string;
}

export interface MessengerLandingPageData {
  messenger: {
    id: string;
    full_name: string;
    landing_page_slug: string;
    custom_goal_text?: string;
    plan_type: PlanType;
  };
  content: LandingPageContent;
}

