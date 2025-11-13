export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      children_profiles: {
        Row: {
          brain_profile: string
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          brain_profile: string
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          brain_profile?: string
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          content: string
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      pdfs: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_size: string | null
          file_url: string
          id: string
          page_count: number | null
          premium_only: boolean | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          file_size?: string | null
          file_url: string
          id?: string
          page_count?: number | null
          premium_only?: boolean | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_size?: string | null
          file_url?: string
          id?: string
          page_count?: number | null
          premium_only?: boolean | null
          title?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          brain_profile: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          premium: boolean | null
          quiz_completed: boolean | null
          welcome_modal_shown: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          brain_profile?: string | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          premium?: boolean | null
          quiz_completed?: boolean | null
          welcome_modal_shown?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          brain_profile?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          premium?: boolean | null
          quiz_completed?: boolean | null
          welcome_modal_shown?: boolean | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          category: string
          created_at: string | null
          estimated_time_minutes: number | null
          id: string
          neurological_tip: string
          phrase_1: string
          phrase_1_action: string
          phrase_2: string
          phrase_2_action: string
          phrase_3: string
          phrase_3_action: string
          profile: string
          tags: string[] | null
          title: string
          wrong_way: string
          // Enhanced context fields
          situation_trigger: string | null
          location_type: string[] | null
          time_optimal: string[] | null
          intensity_level: string | null
          success_speed: string | null
          parent_state: string[] | null
          age_min: number | null
          age_max: number | null
          backup_plan: string | null
          common_mistakes: string[] | null
          pause_after_phrase_1: number | null
          pause_after_phrase_2: number | null
          expected_time_seconds: number | null
          related_script_ids: string[] | null
          difficulty_level: string | null
          requires_preparation: boolean | null
          works_in_public: boolean | null
          emergency_suitable: boolean | null
          // NEW HYPER-SPECIFIC STRUCTURE
          the_situation: string | null
          what_doesnt_work: string | null
          strategy_steps: Json | null
          why_this_works: string | null
          what_to_expect: Json | null
          common_variations: Json | null
          parent_state_needed: string | null
          difficulty: string | null
          duration_minutes: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          estimated_time_minutes?: number | null
          id?: string
          neurological_tip: string
          phrase_1: string
          phrase_1_action: string
          phrase_2: string
          phrase_2_action: string
          phrase_3: string
          phrase_3_action: string
          profile: string
          tags?: string[] | null
          title: string
          wrong_way: string
          // Enhanced context fields
          situation_trigger?: string | null
          location_type?: string[] | null
          time_optimal?: string[] | null
          intensity_level?: string | null
          success_speed?: string | null
          parent_state?: string[] | null
          age_min?: number | null
          age_max?: number | null
          backup_plan?: string | null
          common_mistakes?: string[] | null
          pause_after_phrase_1?: number | null
          pause_after_phrase_2?: number | null
          expected_time_seconds?: number | null
          related_script_ids?: string[] | null
          difficulty_level?: string | null
          requires_preparation?: boolean | null
          works_in_public?: boolean | null
          emergency_suitable?: boolean | null
          // NEW HYPER-SPECIFIC STRUCTURE
          the_situation?: string | null
          what_doesnt_work?: string | null
          strategy_steps?: Json | null
          why_this_works?: string | null
          what_to_expect?: Json | null
          common_variations?: Json | null
          parent_state_needed?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          estimated_time_minutes?: number | null
          id?: string
          neurological_tip?: string
          phrase_1?: string
          phrase_1_action?: string
          phrase_2?: string
          phrase_2_action?: string
          phrase_3?: string
          phrase_3_action?: string
          profile?: string
          tags?: string[] | null
          title?: string
          wrong_way?: string
          // Enhanced context fields
          situation_trigger?: string | null
          location_type?: string[] | null
          time_optimal?: string[] | null
          intensity_level?: string | null
          success_speed?: string | null
          parent_state?: string[] | null
          age_min?: number | null
          age_max?: number | null
          backup_plan?: string | null
          common_mistakes?: string[] | null
          pause_after_phrase_1?: number | null
          pause_after_phrase_2?: number | null
          expected_time_seconds?: number | null
          related_script_ids?: string[] | null
          difficulty_level?: string | null
          requires_preparation?: boolean | null
          works_in_public?: boolean | null
          emergency_suitable?: boolean | null
          // NEW HYPER-SPECIFIC STRUCTURE
          the_situation?: string | null
          what_doesnt_work?: string | null
          strategy_steps?: Json | null
          why_this_works?: string | null
          what_to_expect?: Json | null
          common_variations?: Json | null
          parent_state_needed?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
        }
        Relationships: []
      }
      development_milestones: {
        Row: {
          age_range: string
          brain_profile: string
          created_at: string
          id: string
          milestone_description: string
          milestone_title: string
          recommended_script_ids: string[] | null
          recommended_video_ids: string[] | null
        }
        Insert: {
          age_range: string
          brain_profile: string
          created_at?: string
          id?: string
          milestone_description: string
          milestone_title: string
          recommended_script_ids?: string[] | null
          recommended_video_ids?: string[] | null
        }
        Update: {
          age_range?: string
          brain_profile?: string
          created_at?: string
          id?: string
          milestone_description?: string
          milestone_title?: string
          recommended_script_ids?: string[] | null
          recommended_video_ids?: string[] | null
        }
        Relationships: []
      }
      script_collections: {
        Row: {
          child_profile_id: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          child_profile_id?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          child_profile_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_collections_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      script_collection_items: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          script_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          script_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          script_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "script_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_collection_items_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      script_feedback: {
        Row: {
          child_id: string | null
          created_at: string
          id: string
          notes: string | null
          outcome: string
          script_id: string
          user_id: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          outcome: string
          script_id: string
          user_id: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: string
          script_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_feedback_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tracker_days: {
        Row: {
          child_profile_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          day_number: number
          id: string
          meltdown_count: string | null
          stress_level: number | null
          user_id: string | null
        }
        Insert: {
          child_profile_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          day_number: number
          id?: string
          meltdown_count?: string | null
          stress_level?: number | null
          user_id?: string | null
        }
        Update: {
          child_profile_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          day_number?: number
          id?: string
          meltdown_count?: string | null
          stress_level?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracker_days_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "children_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_days_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string | null
          id: string
          last_check_in: string | null
          pdfs_downloaded: number[] | null
          scripts_used: number | null
          streak: number | null
          user_id: string | null
          videos_watched: number[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_check_in?: string | null
          pdfs_downloaded?: number[] | null
          scripts_used?: number | null
          streak?: number | null
          user_id?: string | null
          videos_watched?: number[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_check_in?: string | null
          pdfs_downloaded?: number[] | null
          scripts_used?: number | null
          streak?: number | null
          user_id?: string | null
          videos_watched?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string
          id: string
          order_index: number | null
          premium_only: boolean | null
          section: string
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: string
          id?: string
          order_index?: number | null
          premium_only?: boolean | null
          section: string
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string
          id?: string
          order_index?: number | null
          premium_only?: boolean | null
          section?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      bonuses: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          thumbnail: string | null
          duration: string | null
          file_size: string | null
          locked: boolean
          completed: boolean
          progress: number
          is_new: boolean
          tags: string[] | null
          view_url: string | null
          download_url: string | null
          unlock_requirement: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          thumbnail?: string | null
          duration?: string | null
          file_size?: string | null
          locked?: boolean
          completed?: boolean
          progress?: number
          is_new?: boolean
          tags?: string[] | null
          view_url?: string | null
          download_url?: string | null
          unlock_requirement?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          thumbnail?: string | null
          duration?: string | null
          file_size?: string | null
          locked?: boolean
          completed?: boolean
          progress?: number
          is_new?: boolean
          tags?: string[] | null
          view_url?: string | null
          download_url?: string | null
          unlock_requirement?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      child_script_recommendations: {
        Row: {
          category: string | null
          child_profile_id: string | null
          estimated_time_minutes: number | null
          feedback_count: number | null
          last_used_at: string | null
          profile: string | null
          script_id: string | null
          success_score: number | null
          tags: string[] | null
          title: string | null
        }
      }
    }
    Functions: {
      has_role: {
        Args: { _role: string; _user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
