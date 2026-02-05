export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_configurations: {
        Row: {
          id: string
          user_id: string
          purpose: string
          tone: string
          preferences: string
          additional_traits: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          purpose: string
          tone: string
          preferences: string
          additional_traits?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          purpose?: string
          tone?: string
          preferences?: string
          additional_traits?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      captions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          generated_caption: string
          prompt: string
          niche_id: string
          user_id: string
          is_favorite: boolean
          usage_count: number
          last_used_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          generated_caption: string
          prompt: string
          niche_id: string
          user_id: string
          is_favorite?: boolean
          usage_count?: number
          last_used_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          generated_caption?: string
          prompt?: string
          niche_id?: string
          user_id?: string
          is_favorite?: boolean
          usage_count?: number
          last_used_at?: string | null
        }
      }
      niches: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          icon: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          website: string | null
          subscription_plan_id: string | null
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_end_date: string | null
          credits_remaining: number
          credits_reset_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website?: string | null
          subscription_plan_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_end_date?: string | null
          credits_remaining?: number
          credits_reset_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website?: string | null
          subscription_plan_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_end_date?: string | null
          credits_remaining?: number
          credits_reset_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          caption_id: string
          scheduled_time: string
          platform: string
          status: 'scheduled' | 'published' | 'failed' | 'cancelled'
          content_type: 'promotional' | 'educational' | 'entertaining' | 'engagement'
          created_at: string
          updated_at: string
          last_updated_at: string | null
          error_message: string | null
          retry_count: number
          next_retry_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          caption_id: string
          scheduled_time: string
          platform: string
          status?: 'scheduled' | 'published' | 'failed' | 'cancelled'
          content_type: 'promotional' | 'educational' | 'entertaining' | 'engagement'
          created_at?: string
          updated_at?: string
          last_updated_at?: string | null
          error_message?: string | null
          retry_count?: number
          next_retry_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          caption_id?: string
          scheduled_time?: string
          platform?: string
          status?: 'scheduled' | 'published' | 'failed' | 'cancelled'
          content_type?: 'promotional' | 'educational' | 'entertaining' | 'engagement'
          created_at?: string
          updated_at?: string
          last_updated_at?: string | null
          error_message?: string | null
          retry_count?: number
          next_retry_at?: string | null
          metadata?: Json | null
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          credits_used: number
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          credits_used: number
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          credits_used?: number
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
