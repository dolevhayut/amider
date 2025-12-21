export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          content_type: Database["public"]["Enums"]["campaign_content_type"] | null
          content_url: string | null
          created_at: string | null
          created_by_admin_id: string | null
          description: string | null
          id: string
          name: string
          scheduled_date: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          target_audience: Database["public"]["Enums"]["campaign_target"] | null
        }
        Insert: {
          content_type?: Database["public"]["Enums"]["campaign_content_type"] | null
          content_url?: string | null
          created_at?: string | null
          created_by_admin_id?: string | null
          description?: string | null
          id?: string
          name: string
          scheduled_date?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: Database["public"]["Enums"]["campaign_target"] | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["campaign_content_type"] | null
          content_url?: string | null
          created_at?: string | null
          created_by_admin_id?: string | null
          description?: string | null
          id?: string
          name?: string
          scheduled_date?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: Database["public"]["Enums"]["campaign_target"] | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name_en: string | null
          name_he: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string | null
          name_he: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string | null
          name_he?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          hebrew_birth_date: string | null
          id: string
          messenger_id: string
          next_payment_date: string | null
          payment_token: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string | null
          user_id: string
          years_of_blessing: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          hebrew_birth_date?: string | null
          id?: string
          messenger_id: string
          next_payment_date?: string | null
          payment_token?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id: string
          years_of_blessing?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          hebrew_birth_date?: string | null
          id?: string
          messenger_id?: string
          next_payment_date?: string | null
          payment_token?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id?: string
          years_of_blessing?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_messenger_id_fkey"
            columns: ["messenger_id"]
            isOneToOne: false
            referencedRelation: "messengers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messengers: {
        Row: {
          commission_rate_monthly: number | null
          commission_rate_one_time: number | null
          created_at: string | null
          custom_goal_text: string | null
          goal_id: string | null
          id: string
          is_active: boolean | null
          landing_page_slug: string
          payment_token: string | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          qr_code_url: string | null
          symbol: string | null
          tzadik_image_url: string | null
          updated_at: string | null
          upgraded_from_member_id: string | null
          user_id: string
          wallet_balance: number | null
        }
        Insert: {
          commission_rate_monthly?: number | null
          commission_rate_one_time?: number | null
          created_at?: string | null
          custom_goal_text?: string | null
          goal_id?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_slug: string
          payment_token?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          qr_code_url?: string | null
          symbol?: string | null
          tzadik_image_url?: string | null
          updated_at?: string | null
          upgraded_from_member_id?: string | null
          user_id: string
          wallet_balance?: number | null
        }
        Update: {
          commission_rate_monthly?: number | null
          commission_rate_one_time?: number | null
          created_at?: string | null
          custom_goal_text?: string | null
          goal_id?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_slug?: string
          payment_token?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          qr_code_url?: string | null
          symbol?: string | null
          tzadik_image_url?: string | null
          updated_at?: string | null
          upgraded_from_member_id?: string | null
          user_id?: string
          wallet_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_upgraded_from_member"
            columns: ["upgraded_from_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messengers_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messengers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          completed_at: string | null
          id: string
          member_id: string
          messenger_id: string
          prayer_intention: string
          prayer_subject_name: string
          status: Database["public"]["Enums"]["prayer_status"] | null
          submitted_at: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          member_id: string
          messenger_id: string
          prayer_intention: string
          prayer_subject_name: string
          status?: Database["public"]["Enums"]["prayer_status"] | null
          submitted_at?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          member_id?: string
          messenger_id?: string
          prayer_intention?: string
          prayer_subject_name?: string
          status?: Database["public"]["Enums"]["prayer_status"] | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_requests_messenger_id_fkey"
            columns: ["messenger_id"]
            isOneToOne: false
            referencedRelation: "messengers"
            referencedColumns: ["id"]
          },
        ]
      }
      tefillin_stands: {
        Row: {
          converted_to_messenger_id: string | null
          id: string
          purchase_amount: number
          purchase_date: string | null
          purchased_by_member_id: string
          qr_code_url: string | null
          stand_location: string | null
        }
        Insert: {
          converted_to_messenger_id?: string | null
          id?: string
          purchase_amount: number
          purchase_date?: string | null
          purchased_by_member_id: string
          qr_code_url?: string | null
          stand_location?: string | null
        }
        Update: {
          converted_to_messenger_id?: string | null
          id?: string
          purchase_amount?: number
          purchase_date?: string | null
          purchased_by_member_id?: string
          qr_code_url?: string | null
          stand_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tefillin_stands_converted_to_messenger_id_fkey"
            columns: ["converted_to_messenger_id"]
            isOneToOne: false
            referencedRelation: "messengers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tefillin_stands_purchased_by_member_id_fkey"
            columns: ["purchased_by_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          related_member_id: string | null
          related_messenger_id: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          related_member_id?: string | null
          related_messenger_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          related_member_id?: string | null
          related_messenger_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_member_id_fkey"
            columns: ["related_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_messenger_id_fkey"
            columns: ["related_messenger_id"]
            isOneToOne: false
            referencedRelation: "messengers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campaign_content_type: "image" | "video" | "text"
      campaign_status: "draft" | "scheduled" | "sent"
      campaign_target: "all_messengers" | "all_members" | "specific"
      plan_type: "18" | "30"
      prayer_status: "active" | "completed" | "archived"
      subscription_status: "active" | "cancelled" | "pending" | "failed"
      subscription_type: "one_time" | "monthly"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      transaction_type:
        | "member_payment"
        | "messenger_commission"
        | "messenger_subscription"
        | "withdrawal"
      user_role: "messenger" | "member" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
