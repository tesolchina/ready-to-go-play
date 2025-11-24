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
      blog_posts: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_date: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_date?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_date?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          chat_type: string
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_type: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_type?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_interactions: {
        Row: {
          created_at: string
          id: string
          lesson_slug: string
          question_id: string
          response_option: string
          section_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_slug: string
          question_id: string
          response_option: string
          section_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_slug?: string
          question_id?: string
          response_option?: string
          section_id?: string
        }
        Relationships: []
      }
      lesson_visitors: {
        Row: {
          id: string
          lesson_slug: string
          visited_at: string
        }
        Insert: {
          id?: string
          lesson_slug: string
          visited_at?: string
        }
        Update: {
          id?: string
          lesson_slug?: string
          visited_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          challenges: string | null
          created_at: string
          generated_content: Json | null
          grade_level: string
          id: string
          is_public: boolean
          learning_objectives: string
          slug: string
          student_context: string | null
          subject: string
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          challenges?: string | null
          created_at?: string
          generated_content?: Json | null
          grade_level: string
          id?: string
          is_public?: boolean
          learning_objectives: string
          slug: string
          student_context?: string | null
          subject: string
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          challenges?: string | null
          created_at?: string
          generated_content?: Json | null
          grade_level?: string
          id?: string
          is_public?: boolean
          learning_objectives?: string
          slug?: string
          student_context?: string | null
          subject?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      paragraph_analyses: {
        Row: {
          analysis_result: Json
          created_at: string
          id: string
          is_default: boolean | null
          paragraph_text: string
          updated_at: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          paragraph_text: string
          updated_at?: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          paragraph_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          created_at: string
          custom_slug: string
          description: string | null
          filename: string
          id: string
          storage_path: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          custom_slug: string
          description?: string | null
          filename: string
          id?: string
          storage_path: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          custom_slug?: string
          description?: string | null
          filename?: string
          id?: string
          storage_path?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      phrasebank_comments: {
        Row: {
          comment_text: string
          created_at: string
          id: string
          updated_at: string
          user_nickname: string
        }
        Insert: {
          comment_text: string
          created_at?: string
          id?: string
          updated_at?: string
          user_nickname: string
        }
        Update: {
          comment_text?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_nickname?: string
        }
        Relationships: []
      }
      phrasebank_posts: {
        Row: {
          category: string | null
          category_type: string | null
          chat_history: Json
          created_at: string | null
          description: string | null
          discipline: string | null
          id: string
          is_featured: boolean | null
          subcategory: string | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          category_type?: string | null
          chat_history: Json
          created_at?: string | null
          description?: string | null
          discipline?: string | null
          id?: string
          is_featured?: boolean | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          category_type?: string | null
          chat_history?: Json
          created_at?: string | null
          description?: string | null
          discipline?: string | null
          id?: string
          is_featured?: boolean | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          institution: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          institution?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          institution?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reflection_analyses: {
        Row: {
          analysis: string
          created_at: string | null
          id: string
          lesson_slug: string
          question: string
          question_id: string
          response_count: number
          section_id: string
          updated_at: string | null
        }
        Insert: {
          analysis: string
          created_at?: string | null
          id?: string
          lesson_slug: string
          question: string
          question_id: string
          response_count?: number
          section_id: string
          updated_at?: string | null
        }
        Update: {
          analysis?: string
          created_at?: string | null
          id?: string
          lesson_slug?: string
          question?: string
          question_id?: string
          response_count?: number
          section_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      response_analytics: {
        Row: {
          created_at: string
          id: string
          key_themes: string[] | null
          lesson_slug: string
          response_text: string
          section_id: string
          sentiment: string | null
          word_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          key_themes?: string[] | null
          lesson_slug: string
          response_text: string
          section_id: string
          sentiment?: string | null
          word_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          key_themes?: string[] | null
          lesson_slug?: string
          response_text?: string
          section_id?: string
          sentiment?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      section_visits: {
        Row: {
          id: string
          lesson_slug: string
          section_id: string
          visited_at: string
        }
        Insert: {
          id?: string
          lesson_slug: string
          section_id: string
          visited_at?: string
        }
        Update: {
          id?: string
          lesson_slug?: string
          section_id?: string
          visited_at?: string
        }
        Relationships: []
      }
      template_submissions: {
        Row: {
          ai_feedback: Json | null
          created_at: string
          id: string
          paragraph_text: string
          pattern_category: string
          pattern_subcategory: string
          template_text: string
          user_answer: string
          user_id: string | null
        }
        Insert: {
          ai_feedback?: Json | null
          created_at?: string
          id?: string
          paragraph_text: string
          pattern_category: string
          pattern_subcategory: string
          template_text: string
          user_answer: string
          user_id?: string | null
        }
        Update: {
          ai_feedback?: Json | null
          created_at?: string
          id?: string
          paragraph_text?: string
          pattern_category?: string
          pattern_subcategory?: string
          template_text?: string
          user_answer?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          encrypted_key: string
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key: string
          id?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_key?: string
          id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_reports: {
        Row: {
          created_at: string
          id: string
          references_input: string
          validation_results: Json
        }
        Insert: {
          created_at?: string
          id?: string
          references_input: string
          validation_results: Json
        }
        Update: {
          created_at?: string
          id?: string
          references_input?: string
          validation_results?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_pdf_slug: { Args: { input_title: string }; Returns: string }
      generate_slug: { Args: { input_title: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher_trainee" | "student"
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
      app_role: ["admin", "teacher_trainee", "student"],
    },
  },
} as const
