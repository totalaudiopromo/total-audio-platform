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
      agent_events: {
        Row: {
          agent_id: string
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_messages: {
        Row: {
          content: string
          created_at: string | null
          from_agent: string
          id: string
          message_type: string | null
          metadata: Json | null
          session_id: string | null
          to_agent: string
        }
        Insert: {
          content: string
          created_at?: string | null
          from_agent: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          session_id?: string | null
          to_agent: string
        }
        Update: {
          content?: string
          created_at?: string | null
          from_agent?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          session_id?: string | null
          to_agent?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agent_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_session_steps: {
        Row: {
          completed_at: string | null
          description: string | null
          error_message: string | null
          id: string
          input: Json | null
          output: Json | null
          session_id: string
          skill_name: string | null
          started_at: string | null
          status: string | null
          step_number: number
        }
        Insert: {
          completed_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          session_id: string
          skill_name?: string | null
          started_at?: string | null
          status?: string | null
          step_number: number
        }
        Update: {
          completed_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          session_id?: string
          skill_name?: string | null
          started_at?: string | null
          status?: string | null
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_session_steps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agent_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_session_steps_skill_name_fkey"
            columns: ["skill_name"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["name"]
          },
        ]
      }
      agent_sessions: {
        Row: {
          agent_name: string
          completed_at: string | null
          cost_usd: number | null
          created_at: string | null
          current_step: number | null
          description: string | null
          duration_ms: number | null
          final_output: Json | null
          id: string
          initial_input: Json
          name: string | null
          started_at: string | null
          status: string
          tokens_used: number | null
          total_steps: number | null
          trace: Json[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_name: string
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string | null
          current_step?: number | null
          description?: string | null
          duration_ms?: number | null
          final_output?: Json | null
          id?: string
          initial_input: Json
          name?: string | null
          started_at?: string | null
          status?: string
          tokens_used?: number | null
          total_steps?: number | null
          trace?: Json[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_name?: string
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string | null
          current_step?: number | null
          description?: string | null
          duration_ms?: number | null
          final_output?: Json | null
          id?: string
          initial_input?: Json
          name?: string | null
          started_at?: string | null
          status?: string
          tokens_used?: number | null
          total_steps?: number | null
          trace?: Json[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_sessions_agent_name_fkey"
            columns: ["agent_name"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["name"]
          },
        ]
      }
      agents: {
        Row: {
          available_skills: string[]
          avatar_emoji: string | null
          color: string | null
          config: Json | null
          created_at: string | null
          description: string | null
          description_short: string | null
          enabled: boolean | null
          flow_shape: string | null
          name: string
          system_prompt: string
          updated_at: string | null
          version: string
        }
        Insert: {
          available_skills: string[]
          avatar_emoji?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          description_short?: string | null
          enabled?: boolean | null
          flow_shape?: string | null
          name: string
          system_prompt: string
          updated_at?: string | null
          version: string
        }
        Update: {
          available_skills?: string[]
          avatar_emoji?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          description_short?: string | null
          enabled?: boolean | null
          flow_shape?: string | null
          name?: string
          system_prompt?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      app_permissions: {
        Row: {
          app_name: string
          granted_at: string
          has_access: boolean
          id: string
          user_id: string
        }
        Insert: {
          app_name: string
          granted_at?: string
          has_access?: boolean
          id?: string
          user_id: string
        }
        Update: {
          app_name?: string
          granted_at?: string
          has_access?: boolean
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      benchmarks: {
        Row: {
          avg_cost_per_result: number
          avg_response_time: number | null
          avg_success_rate: number
          best_day: string | null
          best_month: string | null
          genre: string
          id: string
          last_updated: string | null
          optimal_budget_max: number | null
          optimal_budget_min: number | null
          platform: string
          sample_size: number | null
        }
        Insert: {
          avg_cost_per_result: number
          avg_response_time?: number | null
          avg_success_rate: number
          best_day?: string | null
          best_month?: string | null
          genre: string
          id?: string
          last_updated?: string | null
          optimal_budget_max?: number | null
          optimal_budget_min?: number | null
          platform: string
          sample_size?: number | null
        }
        Update: {
          avg_cost_per_result?: number
          avg_response_time?: number | null
          avg_success_rate?: number
          best_day?: string | null
          best_month?: string | null
          genre?: string
          id?: string
          last_updated?: string | null
          optimal_budget_max?: number | null
          optimal_budget_min?: number | null
          platform?: string
          sample_size?: number | null
        }
        Relationships: []
      }
      campaign_activities: {
        Row: {
          activity_date: string | null
          activity_type: string
          campaign_id: string
          contact_email: string | null
          contact_name: string | null
          contact_org: string | null
          created_at: string | null
          description: string
          id: string
          importance: string | null
          metadata: Json | null
          metric: string | null
          notes: string | null
          platform: string | null
          response_at: string | null
          status: string | null
          submitted_at: string | null
          timestamp: string | null
          type: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          activity_date?: string | null
          activity_type: string
          campaign_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_org?: string | null
          created_at?: string | null
          description: string
          id?: string
          importance?: string | null
          metadata?: Json | null
          metric?: string | null
          notes?: string | null
          platform?: string | null
          response_at?: string | null
          status?: string | null
          submitted_at?: string | null
          timestamp?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          activity_date?: string | null
          activity_type?: string
          campaign_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_org?: string | null
          created_at?: string | null
          description?: string
          id?: string
          importance?: string | null
          metadata?: Json | null
          metric?: string | null
          notes?: string | null
          platform?: string | null
          response_at?: string | null
          status?: string | null
          submitted_at?: string | null
          timestamp?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      campaign_collaborators: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          invited_by: string
          role: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          invited_by: string
          role: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          invited_by?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_collaborators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_events: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          message: string
          status: string
          target: string
          type: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          message: string
          status: string
          target: string
          type: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          message?: string
          status?: string
          target?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_insights: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          key: string
          metric: string
          trend: string
          value: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          key: string
          metric: string
          trend: string
          value: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          key?: string
          metric?: string
          trend?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_insights_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_intelligence: {
        Row: {
          autopsy_text: string | null
          brutal_honesty: string | null
          campaign_id: string
          full_response: string | null
          generated_at: string | null
          id: string
          model_used: string | null
          next_move: string | null
          quick_wins: string | null
          user_id: string
        }
        Insert: {
          autopsy_text?: string | null
          brutal_honesty?: string | null
          campaign_id: string
          full_response?: string | null
          generated_at?: string | null
          id?: string
          model_used?: string | null
          next_move?: string | null
          quick_wins?: string | null
          user_id: string
        }
        Update: {
          autopsy_text?: string | null
          brutal_honesty?: string | null
          campaign_id?: string
          full_response?: string | null
          generated_at?: string | null
          id?: string
          model_used?: string | null
          next_move?: string | null
          quick_wins?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaign_metrics: {
        Row: {
          campaign_id: string
          id: string
          open_rate: number | null
          opens: number | null
          pitches_sent: number | null
          pitches_total: number | null
          replies: number | null
          reply_rate: number | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          id?: string
          open_rate?: number | null
          opens?: number | null
          pitches_sent?: number | null
          pitches_total?: number | null
          replies?: number | null
          reply_rate?: number | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          id?: string
          open_rate?: number | null
          opens?: number | null
          pitches_sent?: number | null
          pitches_total?: number | null
          replies?: number | null
          reply_rate?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_reports: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          end_date: string | null
          executive_summary: string | null
          id: string
          integration_syncs: Json | null
          metadata: Json | null
          pdf_filename: string | null
          pdf_url: string | null
          report_type: string
          sent_to: string[] | null
          start_date: string | null
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          end_date?: string | null
          executive_summary?: string | null
          id?: string
          integration_syncs?: Json | null
          metadata?: Json | null
          pdf_filename?: string | null
          pdf_url?: string | null
          report_type: string
          sent_to?: string[] | null
          start_date?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          end_date?: string | null
          executive_summary?: string | null
          id?: string
          integration_syncs?: Json | null
          metadata?: Json | null
          pdf_filename?: string | null
          pdf_url?: string | null
          report_type?: string
          sent_to?: string[] | null
          start_date?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          goal_total: number | null
          id: string
          release_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_total?: number | null
          id?: string
          release_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_total?: number | null
          id?: string
          release_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      canvas_scenes: {
        Row: {
          created_at: string
          id: string
          scene_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          scene_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          scene_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collaboration_invites: {
        Row: {
          accepted_at: string | null
          campaign_id: string
          created_at: string
          expires_at: string
          id: string
          invite_token: string
          invited_by: string
          invited_email: string
          role: string
        }
        Insert: {
          accepted_at?: string | null
          campaign_id: string
          created_at?: string
          expires_at: string
          id?: string
          invite_token: string
          invited_by: string
          invited_email: string
          role: string
        }
        Update: {
          accepted_at?: string | null
          campaign_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string
          invited_email?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_invites_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          genre_tags: string[] | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          outlet: string | null
          preferred_tone: string | null
          response_rate: number | null
          role: string | null
          total_interactions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          genre_tags?: string[] | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          outlet?: string | null
          preferred_tone?: string | null
          response_rate?: number | null
          role?: string | null
          total_interactions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          genre_tags?: string[] | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          outlet?: string | null
          preferred_tone?: string | null
          response_rate?: number | null
          role?: string | null
          total_interactions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          app: string
          created_at: string | null
          event_name: string
          id: number
          metadata: Json | null
          revenue_impact: number | null
          user_id: string | null
        }
        Insert: {
          app: string
          created_at?: string | null
          event_name: string
          id?: never
          metadata?: Json | null
          revenue_impact?: number | null
          user_id?: string | null
        }
        Update: {
          app?: string
          created_at?: string | null
          event_name?: string
          id?: never
          metadata?: Json | null
          revenue_impact?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      enrichment_logs: {
        Row: {
          api_cost_cents: number | null
          api_tokens_used: number | null
          contacts_count: number
          created_at: string | null
          error_message: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          api_cost_cents?: number | null
          api_tokens_used?: number | null
          contacts_count: number
          created_at?: string | null
          error_message?: string | null
          id?: string
          status: string
          user_id: string
        }
        Update: {
          api_cost_cents?: number | null
          api_tokens_used?: number | null
          contacts_count?: number
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_events: {
        Row: {
          agent_id: string | null
          app: string
          comment: string | null
          created_at: string | null
          id: number
          rating: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          app: string
          comment?: string | null
          created_at?: string | null
          id?: never
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          app?: string
          comment?: string | null
          created_at?: string | null
          id?: never
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      gmail_tracked_emails: {
        Row: {
          campaign_id: string | null
          connection_id: string | null
          contact_email: string
          created_at: string | null
          gmail_message_id: string
          gmail_thread_id: string
          has_reply: boolean | null
          id: string
          last_checked_at: string | null
          reply_message_id: string | null
          reply_received_at: string | null
          reply_snippet: string | null
          sent_at: string
          subject: string
        }
        Insert: {
          campaign_id?: string | null
          connection_id?: string | null
          contact_email: string
          created_at?: string | null
          gmail_message_id: string
          gmail_thread_id: string
          has_reply?: boolean | null
          id?: string
          last_checked_at?: string | null
          reply_message_id?: string | null
          reply_received_at?: string | null
          reply_snippet?: string | null
          sent_at: string
          subject: string
        }
        Update: {
          campaign_id?: string | null
          connection_id?: string | null
          contact_email?: string
          created_at?: string | null
          gmail_message_id?: string
          gmail_thread_id?: string
          has_reply?: boolean | null
          id?: string
          last_checked_at?: string | null
          reply_message_id?: string | null
          reply_received_at?: string | null
          reply_snippet?: string | null
          sent_at?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "gmail_tracked_emails_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_activity_log: {
        Row: {
          activity_type: string
          connection_id: string | null
          created_at: string | null
          id: string
          integration_type: string
          message: string | null
          metadata: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          connection_id?: string | null
          created_at?: string | null
          id?: string
          integration_type: string
          message?: string | null
          metadata?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          connection_id?: string | null
          created_at?: string | null
          id?: string
          integration_type?: string
          message?: string | null
          metadata?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_activity_log_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          created_at: string | null
          credentials: Json
          error_count: number | null
          error_message: string | null
          id: string
          integration_type: string
          last_sync_at: string | null
          settings: Json
          status: string | null
          sync_enabled: boolean | null
          sync_frequency_minutes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json
          error_count?: number | null
          error_message?: string | null
          id?: string
          integration_type: string
          last_sync_at?: string | null
          settings?: Json
          status?: string | null
          sync_enabled?: boolean | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json
          error_count?: number | null
          error_message?: string | null
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          settings?: Json
          status?: string | null
          sync_enabled?: boolean | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      integration_field_mappings: {
        Row: {
          connection_id: string | null
          created_at: string | null
          enabled: boolean | null
          external_field: string
          id: string
          sync_direction: string | null
          tracker_field: string
          transform_rules: Json | null
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          external_field: string
          id?: string
          sync_direction?: string | null
          tracker_field: string
          transform_rules?: Json | null
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          enabled?: boolean | null
          external_field?: string
          id?: string
          sync_direction?: string | null
          tracker_field?: string
          transform_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_field_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_sync_logs: {
        Row: {
          completed_at: string | null
          connection_id: string | null
          created_at: string | null
          direction: string
          duration_ms: number | null
          errors: Json | null
          id: string
          records_created: number | null
          records_failed: number | null
          records_updated: number | null
          started_at: string | null
        }
        Insert: {
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string | null
          direction: string
          duration_ms?: number | null
          errors?: Json | null
          id?: string
          records_created?: number | null
          records_failed?: number | null
          records_updated?: number | null
          started_at?: string | null
        }
        Update: {
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string | null
          direction?: string
          duration_ms?: number | null
          errors?: Json | null
          id?: string
          records_created?: number | null
          records_failed?: number | null
          records_updated?: number | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_states: {
        Row: {
          code_verifier: string | null
          created_at: string | null
          expires_at: string
          id: string
          integration_type: string
          state: string
          user_id: string | null
        }
        Insert: {
          code_verifier?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          integration_type: string
          state: string
          user_id?: string | null
        }
        Update: {
          code_verifier?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          integration_type?: string
          state?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pitch_performance: {
        Row: {
          clicked: boolean | null
          contact_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          opened: boolean | null
          outcome: string | null
          pitch_id: string | null
          replied: boolean | null
          reply_time_hours: number | null
        }
        Insert: {
          clicked?: boolean | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          opened?: boolean | null
          outcome?: string | null
          pitch_id?: string | null
          replied?: boolean | null
          reply_time_hours?: number | null
        }
        Update: {
          clicked?: boolean | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          opened?: boolean | null
          outcome?: string | null
          pitch_id?: string | null
          replied?: boolean | null
          reply_time_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_performance_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitch_performance_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_templates: {
        Row: {
          closing_ctas: Json | null
          created_at: string | null
          description: string | null
          genre: string
          hook_structure: string | null
          id: string
          is_system: boolean | null
          name: string
          opening_lines: Json | null
          success_rate: number | null
          template_body: string
          times_used: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          closing_ctas?: Json | null
          created_at?: string | null
          description?: string | null
          genre: string
          hook_structure?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          opening_lines?: Json | null
          success_rate?: number | null
          template_body: string
          times_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          closing_ctas?: Json | null
          created_at?: string | null
          description?: string | null
          genre?: string
          hook_structure?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          opening_lines?: Json | null
          success_rate?: number | null
          template_body?: string
          times_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pitches: {
        Row: {
          artist_name: string
          contact_id: string | null
          contact_name: string
          contact_outlet: string | null
          created_at: string | null
          genre: string
          id: string
          key_hook: string
          pitch_body: string
          release_date: string | null
          replied_at: string | null
          response_received: boolean | null
          sent_at: string | null
          status: string | null
          subject_line: string
          subject_line_options: Json | null
          suggested_send_time: string | null
          tone: string
          track_link: string | null
          track_title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          artist_name: string
          contact_id?: string | null
          contact_name: string
          contact_outlet?: string | null
          created_at?: string | null
          genre: string
          id?: string
          key_hook: string
          pitch_body: string
          release_date?: string | null
          replied_at?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          status?: string | null
          subject_line: string
          subject_line_options?: Json | null
          suggested_send_time?: string | null
          tone?: string
          track_link?: string | null
          track_title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          artist_name?: string
          contact_id?: string | null
          contact_name?: string
          contact_outlet?: string | null
          created_at?: string | null
          genre?: string
          id?: string
          key_hook?: string
          pitch_body?: string
          release_date?: string | null
          replied_at?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          status?: string | null
          subject_line?: string
          subject_line_options?: Json | null
          suggested_send_time?: string | null
          tone?: string
          track_link?: string | null
          track_title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitches_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      report_sends: {
        Row: {
          clicked_at: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          recipient_email: string
          report_id: string | null
          sent_at: string | null
          sent_via: string
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email: string
          report_id?: string | null
          sent_at?: string | null
          sent_via: string
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email?: string
          report_id?: string | null
          sent_at?: string | null
          sent_via?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_sends_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "campaign_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          brand_color: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_color?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_color?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      skill: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          key: string
          name: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          key: string
          name: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          key?: string
          name?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_binding: {
        Row: {
          config: Json | null
          created_at: string
          enabled: boolean
          id: string
          org_id: string
          skill_id: string | null
          updated_at: string
          user_id: string | null
          version: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          enabled?: boolean
          id?: string
          org_id: string
          skill_id?: string | null
          updated_at?: string
          user_id?: string | null
          version: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          enabled?: boolean
          id?: string
          org_id?: string
          skill_id?: string | null
          updated_at?: string
          user_id?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_binding_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_executions: {
        Row: {
          agent_session_id: string | null
          completed_at: string | null
          cost_usd: number | null
          duration_ms: number | null
          error_message: string | null
          id: string
          input: Json
          output: Json | null
          skill_name: string
          started_at: string | null
          status: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          agent_session_id?: string | null
          completed_at?: string | null
          cost_usd?: number | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input: Json
          output?: Json | null
          skill_name: string
          started_at?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          agent_session_id?: string | null
          completed_at?: string | null
          cost_usd?: number | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input?: Json
          output?: Json | null
          skill_name?: string
          started_at?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_executions_agent_session_id_fkey"
            columns: ["agent_session_id"]
            isOneToOne: false
            referencedRelation: "agent_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_executions_skill_name_fkey"
            columns: ["skill_name"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["name"]
          },
        ]
      }
      skill_invocation: {
        Row: {
          confidence: number | null
          created_at: string
          duration_ms: number | null
          error: string | null
          id: string
          inputs: Json
          org_id: string
          outputs: Json | null
          skill_key: string
          tokens_used: number | null
          user_id: string | null
          version: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          inputs: Json
          org_id: string
          outputs?: Json | null
          skill_key: string
          tokens_used?: number | null
          user_id?: string | null
          version: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          inputs?: Json
          org_id?: string
          outputs?: Json | null
          skill_key?: string
          tokens_used?: number | null
          user_id?: string | null
          version?: string
        }
        Relationships: []
      }
      skill_version: {
        Row: {
          created_at: string
          deprecated_at: string | null
          id: string
          manifest: Json
          skill_id: string | null
          status: string
          version: string
        }
        Insert: {
          created_at?: string
          deprecated_at?: string | null
          id?: string
          manifest: Json
          skill_id?: string | null
          status?: string
          version: string
        }
        Update: {
          created_at?: string
          deprecated_at?: string | null
          id?: string
          manifest?: Json
          skill_id?: string | null
          status?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_version_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          config: Json | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          input_schema: Json
          is_beta: boolean | null
          model: string | null
          name: string
          output_schema: Json
          provider: string
          updated_at: string | null
          version: string
        }
        Insert: {
          category: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          input_schema: Json
          is_beta?: boolean | null
          model?: string | null
          name: string
          output_schema: Json
          provider: string
          updated_at?: string | null
          version: string
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          input_schema?: Json
          is_beta?: boolean | null
          model?: string | null
          name?: string
          output_schema?: Json
          provider?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      user_pitch_settings: {
        Row: {
          batch_limit: number | null
          created_at: string | null
          default_artist_name: string | null
          default_tone: string | null
          id: string
          signature: string | null
          updated_at: string | null
          user_id: string
          voice_achievements: string | null
          voice_approach: string | null
          voice_background: string | null
          voice_context_notes: string | null
          voice_differentiator: string | null
          voice_profile_completed: boolean | null
          voice_style: string | null
          voice_typical_opener: string | null
        }
        Insert: {
          batch_limit?: number | null
          created_at?: string | null
          default_artist_name?: string | null
          default_tone?: string | null
          id?: string
          signature?: string | null
          updated_at?: string | null
          user_id: string
          voice_achievements?: string | null
          voice_approach?: string | null
          voice_background?: string | null
          voice_context_notes?: string | null
          voice_differentiator?: string | null
          voice_profile_completed?: boolean | null
          voice_style?: string | null
          voice_typical_opener?: string | null
        }
        Update: {
          batch_limit?: number | null
          created_at?: string | null
          default_artist_name?: string | null
          default_tone?: string | null
          id?: string
          signature?: string | null
          updated_at?: string | null
          user_id?: string
          voice_achievements?: string | null
          voice_approach?: string | null
          voice_background?: string | null
          voice_context_notes?: string | null
          voice_differentiator?: string | null
          voice_profile_completed?: boolean | null
          voice_style?: string | null
          voice_typical_opener?: string | null
        }
        Relationships: []
      }
      user_prefs: {
        Row: {
          calm_mode: boolean | null
          comfort_mode: boolean | null
          created_at: string
          sound_muted: boolean | null
          theme: string
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calm_mode?: boolean | null
          comfort_mode?: boolean | null
          created_at?: string
          sound_muted?: boolean | null
          theme?: string
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calm_mode?: boolean | null
          comfort_mode?: boolean | null
          created_at?: string
          sound_muted?: boolean | null
          theme?: string
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          campaigns_limit: number | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_beta_user: boolean | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          campaigns_limit?: number | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_beta_user?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          campaigns_limit?: number | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_beta_user?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          beta_access: boolean | null
          company: string | null
          created_at: string | null
          email: string
          enrichments_limit: number | null
          enrichments_used: number | null
          first_name: string | null
          id: string
          last_name: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          beta_access?: boolean | null
          company?: string | null
          created_at?: string | null
          email: string
          enrichments_limit?: number | null
          enrichments_used?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          beta_access?: boolean | null
          company?: string | null
          created_at?: string | null
          email?: string
          enrichments_limit?: number | null
          enrichments_used?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      conversion_summary: {
        Row: {
          app: string | null
          avg_revenue_impact: number | null
          event_count: number | null
          event_name: string | null
          total_revenue_impact: number | null
        }
        Relationships: []
      }
      feedback_summary: {
        Row: {
          app: string | null
          avg_rating: number | null
          negative_feedback: number | null
          positive_feedback: number | null
          total_feedback: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_create_campaign: { Args: { user_id_param: string }; Returns: boolean }
      cleanup_expired_invites: { Args: never; Returns: undefined }
      delete_expired_oauth_states: { Args: never; Returns: undefined }
      get_latest_scene: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          id: string
          scene_data: Json
          updated_at: string
        }[]
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
