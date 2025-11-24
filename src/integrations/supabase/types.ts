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
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      app_config: {
        Row: {
          config_key: string
          config_value: Json
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      approved_users: {
        Row: {
          account_created: boolean | null
          account_created_at: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          currency: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          order_id: string | null
          product_id: string | null
          product_name: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
          webhook_data: Json | null
        }
        Insert: {
          account_created?: boolean | null
          account_created_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_data?: Json | null
        }
        Update: {
          account_created?: boolean | null
          account_created_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "approved_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "approved_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "approved_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "approved_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approved_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          requirement: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          requirement?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          requirement?: string | null
        }
        Relationships: []
      }
      bonuses: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          category: string
          completed: boolean | null
          created_at: string
          description: string
          download_url: string | null
          duration: string | null
          file_size: string | null
          id: string
          is_new: boolean | null
          locked: boolean | null
          progress: number | null
          tags: string[] | null
          thumbnail: string | null
          title: string
          unlock_requirement: string | null
          updated_at: string
          view_url: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          category: string
          completed?: boolean | null
          created_at?: string
          description: string
          download_url?: string | null
          duration?: string | null
          file_size?: string | null
          id?: string
          is_new?: boolean | null
          locked?: boolean | null
          progress?: number | null
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          unlock_requirement?: string | null
          updated_at?: string
          view_url?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          category?: string
          completed?: boolean | null
          created_at?: string
          description?: string
          download_url?: string | null
          duration?: string | null
          file_size?: string | null
          id?: string
          is_new?: boolean | null
          locked?: boolean | null
          progress?: number | null
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          unlock_requirement?: string | null
          updated_at?: string
          view_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number | null
          age_exact: number | null
          brain_profile: string
          challenge_duration: string | null
          challenge_level: number | null
          created_at: string
          development_phase: string | null
          family_context: string[] | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          parent_goals: string[] | null
          parent_id: string
          photo_url: string | null
          result_speed: string | null
          tried_approaches: string[] | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          age_exact?: number | null
          brain_profile: string
          challenge_duration?: string | null
          challenge_level?: number | null
          created_at?: string
          development_phase?: string | null
          family_context?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          parent_goals?: string[] | null
          parent_id: string
          photo_url?: string | null
          result_speed?: string | null
          tried_approaches?: string[] | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          age_exact?: number | null
          brain_profile?: string
          challenge_duration?: string | null
          challenge_level?: number | null
          created_at?: string
          development_phase?: string | null
          family_context?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          parent_goals?: string[] | null
          parent_id?: string
          photo_url?: string | null
          result_speed?: string | null
          tried_approaches?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      collection_scripts: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          position: number
          script_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          position?: number
          script_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          position?: number
          script_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_scripts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "script_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_scripts_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_scripts_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_scripts_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_scripts_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          is_official: boolean | null
          logo_emoji: string | null
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          invite_code: string
          is_official?: boolean | null
          logo_emoji?: string | null
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          invite_code?: string
          is_official?: boolean | null
          logo_emoji?: string | null
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_brain_type: string | null
          author_name: string | null
          author_photo_url: string | null
          community_id: string | null
          content: string
          created_at: string
          duration_minutes: number | null
          id: string
          image_thumbnail_url: string | null
          image_url: string | null
          is_seed_post: boolean | null
          post_type: string | null
          result_type: string | null
          script_used: string | null
          search_vector: unknown
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_brain_type?: string | null
          author_name?: string | null
          author_photo_url?: string | null
          community_id?: string | null
          content: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          image_thumbnail_url?: string | null
          image_url?: string | null
          is_seed_post?: boolean | null
          post_type?: string | null
          result_type?: string | null
          script_used?: string | null
          search_vector?: unknown
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_brain_type?: string | null
          author_name?: string | null
          author_photo_url?: string | null
          community_id?: string | null
          content?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          image_thumbnail_url?: string | null
          image_url?: string | null
          is_seed_post?: boolean | null
          post_type?: string | null
          result_type?: string | null
          script_used?: string | null
          search_vector?: unknown
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          bonus_id: string | null
          content: Json
          cover_color: string | null
          created_at: string | null
          deleted_at: string | null
          estimated_reading_time: number | null
          id: string
          markdown_source: string | null
          metadata: Json | null
          slug: string
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          total_chapters: number
          total_words: number | null
          updated_at: string | null
        }
        Insert: {
          bonus_id?: string | null
          content: Json
          cover_color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          markdown_source?: string | null
          metadata?: Json | null
          slug: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          total_chapters?: number
          total_words?: number | null
          updated_at?: string | null
        }
        Update: {
          bonus_id?: string | null
          content?: Json
          cover_color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          markdown_source?: string | null
          metadata?: Json | null
          slug?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          total_chapters?: number
          total_words?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses_with_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_scripts: {
        Row: {
          created_at: string | null
          id: string
          script_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          script_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          script_id?: string
          user_id?: string
        }
        Relationships: []
      }
      feed_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string | null
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_posts: {
        Row: {
          community_id: string
          content: string
          created_at: string
          duration_minutes: number | null
          id: string
          image_url: string | null
          result_type: string | null
          script_used: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          result_type?: string | null
          script_used?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          result_type?: string | null
          script_used?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "group_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          related_comment_id: string | null
          related_post_id: string | null
          title: string
          type: string
          type_enum: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          related_comment_id?: string | null
          related_post_id?: string | null
          title: string
          type: string
          type_enum?: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          related_comment_id?: string | null
          related_post_id?: string | null
          title?: string
          type?: string
          type_enum?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_related_comment_id_fkey"
            columns: ["related_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pdfs: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_size: string | null
          file_url: string
          id: string
          page_count: number | null
          premium_only: boolean
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_url: string
          id?: string
          page_count?: number | null
          premium_only?: boolean
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_url?: string
          id?: string
          page_count?: number | null
          premium_only?: boolean
          title?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
          replies_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
          replies_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          replies_count?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      post_flags: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_flags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_flags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_flags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_flags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type?: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
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
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          brain_profile: string | null
          child_name: string | null
          comments_count: number
          community_onboarding_completed: boolean | null
          created_at: string
          email: string | null
          followers_count: number
          following_count: number
          id: string
          is_admin: boolean
          likes_received_count: number
          name: string | null
          nickname: string | null
          photo_url: string | null
          posts_count: number
          premium: boolean
          quiz_completed: boolean
          quiz_in_progress: boolean
          role: string | null
          theme: string | null
          updated_at: string | null
          username: string | null
          welcome_modal_shown: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          brain_profile?: string | null
          child_name?: string | null
          comments_count?: number
          community_onboarding_completed?: boolean | null
          created_at?: string
          email?: string | null
          followers_count?: number
          following_count?: number
          id: string
          is_admin?: boolean
          likes_received_count?: number
          name?: string | null
          nickname?: string | null
          photo_url?: string | null
          posts_count?: number
          premium?: boolean
          quiz_completed?: boolean
          quiz_in_progress?: boolean
          role?: string | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
          welcome_modal_shown?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          brain_profile?: string | null
          child_name?: string | null
          comments_count?: number
          community_onboarding_completed?: boolean | null
          created_at?: string
          email?: string | null
          followers_count?: number
          following_count?: number
          id?: string
          is_admin?: boolean
          likes_received_count?: number
          name?: string | null
          nickname?: string | null
          photo_url?: string | null
          posts_count?: number
          premium?: boolean
          quiz_completed?: boolean
          quiz_in_progress?: boolean
          role?: string | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
          welcome_modal_shown?: boolean | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          accepted_partial_refund: string | null
          created_at: string | null
          customer_name: string
          email: string
          id: string
          notes: string | null
          processed_at: string | null
          reason_details: string | null
          reason_type: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accepted_partial_refund?: string | null
          created_at?: string | null
          customer_name: string
          email: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          reason_details?: string | null
          reason_type: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accepted_partial_refund?: string | null
          created_at?: string | null
          customer_name?: string
          email?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          reason_details?: string | null
          reason_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      script_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      script_feedback: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          outcome: string
          script_id: string
          user_id: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          outcome: string
          script_id: string
          user_id: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
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
            referencedRelation: "emergency_scripts_new"
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
            foreignKeyName: "script_feedback_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      script_requests: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          child_age: number | null
          child_brain_profile: string | null
          created_at: string | null
          created_script_id: string | null
          id: string
          location_type: string[] | null
          parent_emotional_state: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          situation_description: string
          status: string | null
          updated_at: string | null
          urgency_level: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          child_age?: number | null
          child_brain_profile?: string | null
          created_at?: string | null
          created_script_id?: string | null
          id?: string
          location_type?: string[] | null
          parent_emotional_state?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          situation_description: string
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          child_age?: number | null
          child_brain_profile?: string | null
          created_at?: string | null
          created_script_id?: string | null
          id?: string
          location_type?: string[] | null
          parent_emotional_state?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          situation_description?: string
          status?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_requests_created_script_id_fkey"
            columns: ["created_script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_requests_created_script_id_fkey"
            columns: ["created_script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_requests_created_script_id_fkey"
            columns: ["created_script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_requests_created_script_id_fkey"
            columns: ["created_script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      script_usage: {
        Row: {
          id: string
          script_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          script_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          script_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          age_max: number | null
          age_min: number | null
          age_range: string | null
          avoid_step1: string | null
          avoid_step2: string | null
          avoid_step3: string | null
          backup_plan: string | null
          category: string
          common_mistakes: string[] | null
          common_variations: Json | null
          created_at: string
          difficulty: string | null
          difficulty_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration_minutes: number | null
          emergency_suitable: boolean | null
          estimated_time_minutes: number | null
          expected_time_seconds: number | null
          id: string
          intensity_level: string | null
          location_type: string[] | null
          neurological_tip: string | null
          parent_state: string[] | null
          parent_state_needed: string | null
          pause_after_phrase_1: number | null
          pause_after_phrase_2: number | null
          phrase_1: string | null
          phrase_1_action: string | null
          phrase_2: string | null
          phrase_2_action: string | null
          phrase_3: string | null
          phrase_3_action: string | null
          profile: string | null
          related_script_ids: string[] | null
          requires_preparation: boolean | null
          say_it_like_this_step1: string | null
          say_it_like_this_step2: string | null
          say_it_like_this_step3: string | null
          situation_trigger: string | null
          strategy_steps: Json | null
          success_speed: string | null
          tags: string[] | null
          the_situation: string | null
          time_optimal: string[] | null
          title: string
          what_doesnt_work: string | null
          what_to_expect: Json | null
          why_this_works: string | null
          works_in_public: boolean | null
          wrong_way: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          age_range?: string | null
          avoid_step1?: string | null
          avoid_step2?: string | null
          avoid_step3?: string | null
          backup_plan?: string | null
          category: string
          common_mistakes?: string[] | null
          common_variations?: Json | null
          created_at?: string
          difficulty?: string | null
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration_minutes?: number | null
          emergency_suitable?: boolean | null
          estimated_time_minutes?: number | null
          expected_time_seconds?: number | null
          id?: string
          intensity_level?: string | null
          location_type?: string[] | null
          neurological_tip?: string | null
          parent_state?: string[] | null
          parent_state_needed?: string | null
          pause_after_phrase_1?: number | null
          pause_after_phrase_2?: number | null
          phrase_1?: string | null
          phrase_1_action?: string | null
          phrase_2?: string | null
          phrase_2_action?: string | null
          phrase_3?: string | null
          phrase_3_action?: string | null
          profile?: string | null
          related_script_ids?: string[] | null
          requires_preparation?: boolean | null
          say_it_like_this_step1?: string | null
          say_it_like_this_step2?: string | null
          say_it_like_this_step3?: string | null
          situation_trigger?: string | null
          strategy_steps?: Json | null
          success_speed?: string | null
          tags?: string[] | null
          the_situation?: string | null
          time_optimal?: string[] | null
          title: string
          what_doesnt_work?: string | null
          what_to_expect?: Json | null
          why_this_works?: string | null
          works_in_public?: boolean | null
          wrong_way?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          age_range?: string | null
          avoid_step1?: string | null
          avoid_step2?: string | null
          avoid_step3?: string | null
          backup_plan?: string | null
          category?: string
          common_mistakes?: string[] | null
          common_variations?: Json | null
          created_at?: string
          difficulty?: string | null
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration_minutes?: number | null
          emergency_suitable?: boolean | null
          estimated_time_minutes?: number | null
          expected_time_seconds?: number | null
          id?: string
          intensity_level?: string | null
          location_type?: string[] | null
          neurological_tip?: string | null
          parent_state?: string[] | null
          parent_state_needed?: string | null
          pause_after_phrase_1?: number | null
          pause_after_phrase_2?: number | null
          phrase_1?: string | null
          phrase_1_action?: string | null
          phrase_2?: string | null
          phrase_2_action?: string | null
          phrase_3?: string | null
          phrase_3_action?: string | null
          profile?: string | null
          related_script_ids?: string[] | null
          requires_preparation?: boolean | null
          say_it_like_this_step1?: string | null
          say_it_like_this_step2?: string | null
          say_it_like_this_step3?: string | null
          situation_trigger?: string | null
          strategy_steps?: Json | null
          success_speed?: string | null
          tags?: string[] | null
          the_situation?: string | null
          time_optimal?: string[] | null
          title?: string
          what_doesnt_work?: string | null
          what_to_expect?: Json | null
          why_this_works?: string | null
          works_in_public?: boolean | null
          wrong_way?: string | null
        }
        Relationships: []
      }
      scripts_usage: {
        Row: {
          created_at: string | null
          id: string
          script_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          script_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          script_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      tracker_days: {
        Row: {
          child_id: string | null
          child_profile_id: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          date: string | null
          day_number: number
          id: string
          meltdown_count: string | null
          notes: string | null
          streak_freeze_used: boolean
          stress_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          child_id?: string | null
          child_profile_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          date?: string | null
          day_number: number
          id?: string
          meltdown_count?: string | null
          notes?: string | null
          streak_freeze_used?: boolean
          stress_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          child_id?: string | null
          child_profile_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          date?: string | null
          day_number?: number
          id?: string
          meltdown_count?: string | null
          notes?: string | null
          streak_freeze_used?: boolean
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracker_days_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_days_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_type: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_app_versions: {
        Row: {
          acknowledged_at: string | null
          created_at: string | null
          current_build: number
          current_version: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string | null
          current_build: number
          current_version: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string | null
          current_build?: number
          current_version?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_bonus_progress: {
        Row: {
          bonus_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          progress_seconds: number | null
          total_duration_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress_seconds?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress_seconds?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bonus_progress_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonus_progress_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses_with_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bonuses: {
        Row: {
          bonus_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          unlocked_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bonuses_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonuses_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses_with_user_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_ebook_progress: {
        Row: {
          bookmarks: Json | null
          completed_chapters: number[] | null
          current_chapter: number
          ebook_id: string
          first_read_at: string | null
          highlights: Json | null
          id: string
          last_read_at: string | null
          notes: Json | null
          reading_preferences: Json | null
          reading_time_minutes: number | null
          scroll_position: number | null
          sessions_count: number | null
          user_id: string
        }
        Insert: {
          bookmarks?: Json | null
          completed_chapters?: number[] | null
          current_chapter?: number
          ebook_id: string
          first_read_at?: string | null
          highlights?: Json | null
          id?: string
          last_read_at?: string | null
          notes?: Json | null
          reading_preferences?: Json | null
          reading_time_minutes?: number | null
          scroll_position?: number | null
          sessions_count?: number | null
          user_id: string
        }
        Update: {
          bookmarks?: Json | null
          completed_chapters?: number[] | null
          current_chapter?: number
          ebook_id?: string
          first_read_at?: string | null
          highlights?: Json | null
          id?: string
          last_read_at?: string | null
          notes?: Json | null
          reading_preferences?: Json | null
          reading_time_minutes?: number | null
          scroll_position?: number | null
          sessions_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          script_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          script_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          script_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_progress: {
        Row: {
          child_profile: string | null
          created_at: string
          id: string
          last_check_in: string | null
          quiz_completed: boolean
          scripts_used: number
          streak: number
          updated_at: string
          user_id: string
          videos_watched: string[] | null
        }
        Insert: {
          child_profile?: string | null
          created_at?: string
          id?: string
          last_check_in?: string | null
          quiz_completed?: boolean
          scripts_used?: number
          streak?: number
          updated_at?: string
          user_id: string
          videos_watched?: string[] | null
        }
        Update: {
          child_profile?: string | null
          created_at?: string
          id?: string
          last_check_in?: string | null
          quiz_completed?: boolean
          scripts_used?: number
          streak?: number
          updated_at?: string
          user_id?: string
          videos_watched?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_bookmarks: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          last_watched_at: string
          progress_seconds: number
          total_duration_seconds: number
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          last_watched_at?: string
          progress_seconds?: number
          total_duration_seconds?: number
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          last_watched_at?: string
          progress_seconds?: number
          total_duration_seconds?: number
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress_backup_20250122: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string | null
          last_watched_at: string | null
          progress_seconds: number | null
          total_duration_seconds: number | null
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string | null
          last_watched_at?: string | null
          progress_seconds?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string | null
          last_watched_at?: string | null
          progress_seconds?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          attribution_required: boolean | null
          created_at: string
          creator_name: string | null
          description: string | null
          duration: string | null
          id: string
          license_type: string | null
          locked: boolean
          order_index: number
          original_url: string | null
          premium_only: boolean
          section: string
          thumbnail_url: string | null
          title: string
          verified_date: string | null
          video_url: string
        }
        Insert: {
          attribution_required?: boolean | null
          created_at?: string
          creator_name?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          license_type?: string | null
          locked?: boolean
          order_index?: number
          original_url?: string | null
          premium_only?: boolean
          section: string
          thumbnail_url?: string | null
          title: string
          verified_date?: string | null
          video_url: string
        }
        Update: {
          attribution_required?: boolean | null
          created_at?: string
          creator_name?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          license_type?: string | null
          locked?: boolean
          order_index?: number
          original_url?: string | null
          premium_only?: boolean
          section?: string
          thumbnail_url?: string | null
          title?: string
          verified_date?: string | null
          video_url?: string
        }
        Relationships: []
      }
      videos_backup_20250122: {
        Row: {
          attribution_required: boolean | null
          created_at: string | null
          creator_name: string | null
          description: string | null
          duration: string | null
          id: string | null
          license_type: string | null
          locked: boolean | null
          order_index: number | null
          original_url: string | null
          premium_only: boolean | null
          section: string | null
          thumbnail_url: string | null
          title: string | null
          verified_date: string | null
          video_url: string | null
        }
        Insert: {
          attribution_required?: boolean | null
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          duration?: string | null
          id?: string | null
          license_type?: string | null
          locked?: boolean | null
          order_index?: number | null
          original_url?: string | null
          premium_only?: boolean | null
          section?: string | null
          thumbnail_url?: string | null
          title?: string | null
          verified_date?: string | null
          video_url?: string | null
        }
        Update: {
          attribution_required?: boolean | null
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          duration?: string | null
          id?: string | null
          license_type?: string | null
          locked?: boolean | null
          order_index?: number | null
          original_url?: string | null
          premium_only?: boolean | null
          section?: string | null
          thumbnail_url?: string | null
          title?: string | null
          verified_date?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      bonuses_with_user_progress: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          category: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          download_url: string | null
          duration: string | null
          ebook_completed_chapters: number[] | null
          ebook_current_chapter: number | null
          ebook_id: string | null
          ebook_slug: string | null
          ebook_total_chapters: number | null
          file_size: string | null
          id: string | null
          is_new: boolean | null
          locked: boolean | null
          progress: number | null
          tags: string[] | null
          thumbnail: string | null
          title: string | null
          unlock_requirement: string | null
          updated_at: string | null
          user_completed_at: string | null
          user_progress: number | null
          user_unlocked_at: string | null
          view_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comments_with_profiles: {
        Row: {
          author_name: string | null
          content: string | null
          created_at: string | null
          id: string | null
          post_id: string | null
          profile_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts_with_profiles: {
        Row: {
          author_brain_type: string | null
          author_name: string | null
          author_photo_url: string | null
          content: string | null
          created_at: string | null
          id: string | null
          image_thumbnail_url: string | null
          image_url: string | null
          is_seed_post: boolean | null
          post_type: string | null
          profile_name: string | null
          search_vector: unknown
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_posts_with_stats: {
        Row: {
          author_brain_type: string | null
          author_name: string | null
          author_photo_url: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          image_thumbnail_url: string | null
          image_url: string | null
          is_seed_post: boolean | null
          likes_count: number | null
          post_type: string | null
          profile_email: string | null
          profile_name: string | null
          profile_photo: string | null
          search_vector: unknown
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          active_users_week: number | null
          average_stress: number | null
          meltdowns_after_day_7: number | null
          meltdowns_before_day_7: number | null
          posts_this_week: number | null
          script_uses_today: number | null
          script_uses_week: number | null
          scripts_today_count: number | null
          total_pdfs: number | null
          total_script_uses: number | null
          total_scripts: number | null
          total_tracker_entries: number | null
          total_videos: number | null
          unique_scripts_used: number | null
          user_id: string | null
        }
        Relationships: []
      }
      ebooks_with_stats: {
        Row: {
          avg_reading_time: number | null
          bonus_id: string | null
          completed_count: number | null
          completion_rate: number | null
          content: Json | null
          cover_color: string | null
          created_at: string | null
          deleted_at: string | null
          estimated_reading_time: number | null
          id: string | null
          markdown_source: string | null
          metadata: Json | null
          slug: string | null
          subtitle: string | null
          thumbnail_url: string | null
          title: string | null
          total_chapters: number | null
          total_readers: number | null
          total_words: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses_with_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_scripts_new: {
        Row: {
          category: string | null
          difficulty: string | null
          duration_minutes: number | null
          id: string | null
          profile: string | null
          situation: string | null
          strategy_steps: Json | null
          success_rate_percent: number | null
          title: string | null
          total_uses: number | null
          what_to_expect: Json | null
          worked_count: number | null
        }
        Relationships: []
      }
      leaderboard_cache: {
        Row: {
          current_streak: number | null
          full_name: string | null
          id: string | null
          longest_streak: number | null
          photo_url: string | null
          scripts_used: number | null
          total_xp: number | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_achievements_stats"
            referencedColumns: ["user_id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          badges: string[] | null
          bio: string | null
          comments_count: number | null
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          id: string | null
          likes_received_count: number | null
          name: string | null
          photo_url: string | null
          posts_count: number | null
          updated_at: string | null
        }
        Insert: {
          badges?: string[] | null
          bio?: string | null
          comments_count?: number | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string | null
          likes_received_count?: number | null
          name?: string | null
          photo_url?: string | null
          posts_count?: number | null
          updated_at?: string | null
        }
        Update: {
          badges?: string[] | null
          bio?: string | null
          comments_count?: number | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string | null
          likes_received_count?: number | null
          name?: string | null
          photo_url?: string | null
          posts_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scripts_card_view: {
        Row: {
          age_max: number | null
          age_min: number | null
          age_range: string | null
          avoid_step1: string | null
          avoid_step2: string | null
          avoid_step3: string | null
          backup_plan: string | null
          category: string | null
          common_mistakes: string[] | null
          common_variations: Json | null
          created_at: string | null
          difficulty: string | null
          difficulty_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration_minutes: number | null
          emergency_suitable: boolean | null
          estimated_time_minutes: number | null
          expected_time_seconds: number | null
          feedback_count: number | null
          id: string | null
          intensity_level: string | null
          location_type: string[] | null
          neurological_tip: string | null
          parent_state: string[] | null
          parent_state_needed: string | null
          pause_after_phrase_1: number | null
          pause_after_phrase_2: number | null
          phrase_1: string | null
          phrase_1_action: string | null
          phrase_2: string | null
          phrase_2_action: string | null
          phrase_3: string | null
          phrase_3_action: string | null
          profile: string | null
          related_script_ids: string[] | null
          requires_preparation: boolean | null
          say_it_like_this_step1: string | null
          say_it_like_this_step2: string | null
          say_it_like_this_step3: string | null
          situation_trigger: string | null
          strategy_steps: Json | null
          success_count: number | null
          success_speed: string | null
          tags: string[] | null
          the_situation: string | null
          time_optimal: string[] | null
          title: string | null
          usage_count: number | null
          what_doesnt_work: string | null
          what_to_expect: Json | null
          why_this_works: string | null
          works_in_public: boolean | null
          wrong_way: string | null
        }
        Relationships: []
      }
      scripts_with_full_stats: {
        Row: {
          age_max: number | null
          age_min: number | null
          age_range: string | null
          avoid_step1: string | null
          avoid_step2: string | null
          avoid_step3: string | null
          backup_plan: string | null
          category: string | null
          common_mistakes: string[] | null
          common_variations: Json | null
          created_at: string | null
          didnt_work_count: number | null
          difficulty: string | null
          difficulty_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration_minutes: number | null
          emergency_suitable: boolean | null
          estimated_time_minutes: number | null
          expected_time_seconds: number | null
          id: string | null
          intensity_level: string | null
          location_type: string[] | null
          neurological_tip: string | null
          parent_state: string[] | null
          parent_state_needed: string | null
          pause_after_phrase_1: number | null
          pause_after_phrase_2: number | null
          phrase_1: string | null
          phrase_1_action: string | null
          phrase_2: string | null
          phrase_2_action: string | null
          phrase_3: string | null
          phrase_3_action: string | null
          profile: string | null
          progress_count: number | null
          related_script_ids: string[] | null
          requires_preparation: boolean | null
          say_it_like_this_step1: string | null
          say_it_like_this_step2: string | null
          say_it_like_this_step3: string | null
          situation_trigger: string | null
          strategy_steps: Json | null
          success_rate: number | null
          success_speed: string | null
          tags: string[] | null
          the_situation: string | null
          time_optimal: string[] | null
          title: string | null
          total_feedback: number | null
          total_uses: number | null
          what_doesnt_work: string | null
          what_to_expect: Json | null
          why_this_works: string | null
          worked_count: number | null
          works_in_public: boolean | null
          wrong_way: string | null
        }
        Relationships: []
      }
      user_achievements_stats: {
        Row: {
          current_streak: number | null
          days_completed: number | null
          longest_streak: number | null
          morning_logs: number | null
          night_logs: number | null
          posts_created: number | null
          reactions_received: number | null
          scripts_used: number | null
          user_id: string | null
          videos_watched: number | null
        }
        Relationships: []
      }
      user_recent_ebooks: {
        Row: {
          bonus_id: string | null
          content: Json | null
          cover_color: string | null
          created_at: string | null
          current_chapter: number | null
          deleted_at: string | null
          estimated_reading_time: number | null
          id: string | null
          last_read_at: string | null
          markdown_source: string | null
          metadata: Json | null
          progress_percentage: number | null
          reading_time_minutes: number | null
          slug: string | null
          subtitle: string | null
          thumbnail_url: string | null
          title: string | null
          total_chapters: number | null
          total_words: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebooks_bonus_id_fkey"
            columns: ["bonus_id"]
            isOneToOne: false
            referencedRelation: "bonuses_with_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      user_script_stats: {
        Row: {
          feedback_count: number | null
          last_used: string | null
          personal_success_rate: number | null
          script_id: string | null
          times_used: number | null
          times_worked: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "emergency_scripts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_usage_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts_with_full_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          anonymous_name: string | null
          brain_profile: string | null
          child_profile_id: string | null
          completed_days: number | null
          current_streak: number | null
          last_active_date: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracker_days_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      acknowledge_app_update: { Args: never; Returns: Json }
      add_bookmark: {
        Args: {
          p_chapter: number
          p_ebook_id: string
          p_label?: string
          p_position: number
        }
        Returns: undefined
      }
      admin_delete_script: {
        Args: { script_id_param: string }
        Returns: undefined
      }
      archive_bonus: { Args: { p_bonus_id: string }; Returns: Json }
      calculate_streak: {
        Args: { p_child_profile_id: string; p_user_id: string }
        Returns: number
      }
      calculate_user_streak: {
        Args: { p_user_id: string }
        Returns: {
          current_streak: number
          longest_streak: number
        }[]
      }
      can_access_script: { Args: never; Returns: boolean }
      check_and_unlock_badges: {
        Args: { p_user_id: string }
        Returns: {
          unlocked_badge_icon: string
          unlocked_badge_id: string
          unlocked_badge_name: string
        }[]
      }
      check_streak_milestone: {
        Args: { p_child_profile_id: string; p_user_id: string }
        Returns: Json
      }
      check_user_needs_update: { Args: never; Returns: Json }
      clear_force_update_flag: { Args: never; Returns: Json }
      decrement_comment_replies: {
        Args: { comment_id: string }
        Returns: undefined
      }
      force_app_update: { Args: { update_message?: string }; Returns: Json }
      generate_invite_code: { Args: never; Returns: string }
      get_app_version: { Args: never; Returns: Json }
      get_community_members: {
        Args: { p_community_id: string }
        Returns: {
          brain_profile: string
          id: string
          joined_at: string
          name: string
          photo_url: string
          role: string
          user_id: string
          username: string
        }[]
      }
      get_orphaned_ebooks: {
        Args: never
        Returns: {
          created_at: string
          id: string
          slug: string
          title: string
          total_chapters: number
        }[]
      }
      get_post_reactions: {
        Args: { p_post_id: string }
        Returns: {
          count: number
          emoji: string
          users: Json
        }[]
      }
      get_profile_data: {
        Args: { profile_user_id: string }
        Returns: {
          badges: string[]
          bio: string
          comments_count: number
          created_at: string
          email: string
          followers_count: number
          following_count: number
          id: string
          is_admin: boolean
          is_premium: boolean
          likes_received_count: number
          name: string
          photo_url: string
          posts_count: number
          updated_at: string
        }[]
      }
      get_remaining_script_accesses: { Args: never; Returns: Json }
      get_sos_script: {
        Args: {
          p_child_id?: string
          p_location?: string
          p_situation?: string
          p_user_id: string
        }
        Returns: {
          personal_success_rate: number
          relevance_score: number
          script_id: string
          situation_trigger: string
          success_rate: number
          title: string
          usage_count: number
        }[]
      }
      get_update_statistics: { Args: never; Returns: Json }
      get_user_collection_counts: { Args: never; Returns: Json }
      get_user_likes_count: {
        Args: { target_user_id: string }
        Returns: number
      }
      get_user_streak: {
        Args: { p_user_id: string }
        Returns: {
          current_streak: number
          longest_streak: number
          total_days: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_comment_replies: {
        Args: { comment_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_community_leader: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      is_community_member: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      is_email_approved: { Args: { p_email: string }; Returns: boolean }
      mark_chapter_complete: {
        Args: { p_chapter_index: number; p_ebook_id: string }
        Returns: undefined
      }
      require_admin: { Args: never; Returns: undefined }
      restore_bonus: { Args: { p_bonus_id: string }; Returns: Json }
      save_child_profile: {
        Args: {
          child_name?: string
          child_profile?: string
          email?: string
          parent_name?: string
          quiz_completed?: boolean
        }
        Returns: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          brain_profile: string | null
          child_name: string | null
          comments_count: number
          community_onboarding_completed: boolean | null
          created_at: string
          email: string | null
          followers_count: number
          following_count: number
          id: string
          is_admin: boolean
          likes_received_count: number
          name: string | null
          nickname: string | null
          photo_url: string | null
          posts_count: number
          premium: boolean
          quiz_completed: boolean
          quiz_in_progress: boolean
          role: string | null
          theme: string | null
          updated_at: string | null
          username: string | null
          welcome_modal_shown: boolean | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      search_scripts_natural: {
        Args: {
          search_query: string
          user_age_max?: number
          user_age_min?: number
          user_brain_profile?: string
        }
        Returns: {
          category: string
          difficulty: string
          match_context: string
          profile: string
          relevance_score: number
          script_id: string
          title: string
        }[]
      }
      send_notification: {
        Args: {
          p_actor_id?: string
          p_link?: string
          p_message: string
          p_related_comment_id?: string
          p_related_post_id?: string
          p_title: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_user_id: string
        }
        Returns: string
      }
      sync_bonus_progress: {
        Args: { p_ebook_id: string; p_user_id: string }
        Returns: Json
      }
      toggle_group_reaction: {
        Args: { p_emoji: string; p_post_id: string }
        Returns: Json
      }
      update_reading_time: {
        Args: { p_ebook_id: string; p_minutes_delta: number }
        Returns: undefined
      }
      verify_schema_fixes: {
        Args: never
        Returns: {
          check_name: string
          details: string
          status: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty_level: "Easy" | "Moderate" | "Hard"
      notification_type: "like" | "comment" | "reply" | "mention" | "follow"
      reaction_type:
        | "like"
        | "love"
        | "strong"
        | "empathy"
        | "celebrate"
        | "insightful"
        | "helpful"
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
    Enums: {
      app_role: ["admin", "user"],
      difficulty_level: ["Easy", "Moderate", "Hard"],
      notification_type: ["like", "comment", "reply", "mention", "follow"],
      reaction_type: [
        "like",
        "love",
        "strong",
        "empathy",
        "celebrate",
        "insightful",
        "helpful",
      ],
    },
  },
} as const
