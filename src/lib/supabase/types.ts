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
      captions: {
        Row: {
          id: string
          created_at: string
          generated_caption: string
          prompt: string
          niche_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          generated_caption: string
          prompt: string
          niche_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          generated_caption?: string
          prompt?: string
          niche_id?: string
          user_id?: string
        }
      }
      niches: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
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