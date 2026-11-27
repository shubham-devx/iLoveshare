export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface EventDetails {
  eventDate?: string;
  eventTime?: string;
  location?: string;
  mapLink?: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          is_deleted: boolean
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
          deleted_at?: string | null
        }
      }
      experiences: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          recipient_type: string
          recipient_name: string
          sender_name: string
          relationship: string | null
          personal_greeting: string | null
          message: string | null
          theme: string
          animations: string[]
          music_enabled: boolean
          music_url: string | null
          response_type: string
          custom_response_label: string | null
          enable_star_rating: boolean
          enable_written_feedback: boolean
          token: string
          status: 'draft' | 'published' | 'archived' | 'deleted'
          scheduled_at: string | null
          expires_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          view_count: number
          response_count: number
          is_deleted: boolean
          deleted_at: string | null
          passcode: string | null
          language: 'en' | 'hi'
          event_details: EventDetails | null
          milestones: TimelineMilestone[] | null
          scratch_message: string | null
          creative_features: string[] | null
          group_delivery: boolean
          lock_after_response: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          recipient_type: string
          recipient_name: string
          sender_name: string
          relationship?: string | null
          personal_greeting?: string | null
          message?: string | null
          theme?: string
          animations?: string[]
          music_enabled?: boolean
          music_url?: string | null
          response_type?: string
          custom_response_label?: string | null
          enable_star_rating?: boolean
          enable_written_feedback?: boolean
          token?: string
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          scheduled_at?: string | null
          expires_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          response_count?: number
          is_deleted?: boolean
          deleted_at?: string | null
          passcode?: string | null
          language?: 'en' | 'hi'
          event_details?: EventDetails | null
          milestones?: TimelineMilestone[] | null
          scratch_message?: string | null
          creative_features?: string[] | null
          group_delivery?: boolean
          lock_after_response?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          recipient_type?: string
          recipient_name?: string
          sender_name?: string
          relationship?: string | null
          personal_greeting?: string | null
          message?: string | null
          theme?: string
          animations?: string[]
          music_enabled?: boolean
          music_url?: string | null
          response_type?: string
          custom_response_label?: string | null
          enable_star_rating?: boolean
          enable_written_feedback?: boolean
          token?: string
          status?: 'draft' | 'published' | 'archived' | 'deleted'
          scheduled_at?: string | null
          expires_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          response_count?: number
          is_deleted?: boolean
          deleted_at?: string | null
          passcode?: string | null
          language?: 'en' | 'hi'
          event_details?: EventDetails | null
          milestones?: TimelineMilestone[] | null
          scratch_message?: string | null
          creative_features?: string[] | null
          group_delivery?: boolean
          lock_after_response?: boolean
        }
      }
      experience_recipients: {
        Row: {
          id: string
          experience_id: string
          name: string
          email: string | null
          relationship: string | null
          personal_token: string
          has_opened: boolean
          opened_at: string | null
          has_responded: boolean
          responded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          name: string
          email?: string | null
          relationship?: string | null
          personal_token: string
          has_opened?: boolean
          opened_at?: string | null
          has_responded?: boolean
          responded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          name?: string
          email?: string | null
          relationship?: string | null
          personal_token?: string
          has_opened?: boolean
          opened_at?: string | null
          has_responded?: boolean
          responded_at?: string | null
          created_at?: string
        }
      }
      experience_attachments: {
        Row: {
          id: string
          experience_id: string
          user_id: string
          type: 'photo' | 'pdf' | 'audio'
          url: string
          file_name: string
          file_size: number
          mime_type: string
          storage_path: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          user_id: string
          type: 'photo' | 'pdf' | 'audio'
          url: string
          file_name: string
          file_size: number
          mime_type: string
          storage_path: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          user_id?: string
          type?: 'photo' | 'pdf' | 'audio'
          url?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          storage_path?: string
          order_index?: number
          created_at?: string
        }
      }
      experience_responses: {
        Row: {
          id: string
          experience_id: string
          response_type: string
          response_value: string | null
          respondent_name: string | null
          star_rating: number | null
          written_feedback: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          response_type: string
          response_value?: string | null
          respondent_name?: string | null
          star_rating?: number | null
          written_feedback?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          response_type?: string
          response_value?: string | null
          respondent_name?: string | null
          star_rating?: number | null
          written_feedback?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      experience_feedback: {
        Row: {
          id: string
          experience_id: string
          response_id: string | null
          rating: number
          comment: string | null
          recipient_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          response_id?: string | null
          rating: number
          comment?: string | null
          recipient_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          response_id?: string | null
          rating?: number
          comment?: string | null
          recipient_name?: string | null
          created_at?: string
        }
      }
      experience_analytics: {
        Row: {
          id: string
          experience_id: string
          event_type: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          event_type: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          event_type?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      experience_themes: {
        Row: {
          id: string
          name: string
          description: string
          primary_color: string
          secondary_color: string
          accent_color: string
          is_premium: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          primary_color: string
          secondary_color: string
          accent_color: string
          is_premium?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          is_premium?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      scheduled_deliveries: {
        Row: {
          id: string
          experience_id: string
          user_id: string
          scheduled_for: string
          recipient_email: string | null
          status: 'pending' | 'sent' | 'failed' | 'cancelled'
          sent_at: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          user_id: string
          scheduled_for: string
          recipient_email?: string | null
          status?: 'pending' | 'sent' | 'failed' | 'cancelled'
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          user_id?: string
          scheduled_for?: string
          recipient_email?: string | null
          status?: 'pending' | 'sent' | 'failed' | 'cancelled'
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          experience_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          experience_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          experience_id?: string | null
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type ExperienceRecipient = Database['public']['Tables']['experience_recipients']['Row']
export type ExperienceAttachment = Database['public']['Tables']['experience_attachments']['Row']
export type ExperienceResponse = Database['public']['Tables']['experience_responses']['Row']
export type ExperienceFeedback = Database['public']['Tables']['experience_feedback']['Row']
export type ExperienceAnalytic = Database['public']['Tables']['experience_analytics']['Row']
export type ExperienceTheme = Database['public']['Tables']['experience_themes']['Row']
export type ScheduledDelivery = Database['public']['Tables']['scheduled_deliveries']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
