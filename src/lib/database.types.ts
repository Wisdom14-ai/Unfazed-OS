export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            book_notes: {
                Row: {
                    author: string
                    color: string | null
                    created_at: string | null
                    id: string
                    insight: string
                    model: string
                    title: string
                }
                Insert: {
                    author?: string
                    color?: string | null
                    created_at?: string | null
                    id?: string
                    insight?: string
                    model?: string
                    title: string
                }
                Update: {
                    author?: string
                    color?: string | null
                    created_at?: string | null
                    id?: string
                    insight?: string
                    model?: string
                    title?: string
                }
                Relationships: []
            }
            daily_metadata: {
                Row: {
                    created_at: string | null
                    date: string
                    id: string
                    location: string | null
                    notes: string | null
                    omad_done: boolean | null
                    protein_hit: boolean | null
                    screen_time_hours: number | null
                    water_3l: boolean | null
                    whole_foods_first: boolean | null
                }
                Insert: {
                    created_at?: string | null
                    date: string
                    id?: string
                    location?: string | null
                    notes?: string | null
                    omad_done?: boolean | null
                    protein_hit?: boolean | null
                    screen_time_hours?: number | null
                    water_3l?: boolean | null
                    whole_foods_first?: boolean | null
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    id?: string
                    location?: string | null
                    notes?: string | null
                    omad_done?: boolean | null
                    protein_hit?: boolean | null
                    screen_time_hours?: number | null
                    water_3l?: boolean | null
                    whole_foods_first?: boolean | null
                }
                Relationships: []
            }
            deep_work_sessions: {
                Row: {
                    completed: boolean | null
                    created_at: string | null
                    date: string
                    focus: string
                    hours: number
                    id: string
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string | null
                    date: string
                    focus?: string
                    hours?: number
                    id?: string
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string | null
                    date?: string
                    focus?: string
                    hours?: number
                    id?: string
                }
                Relationships: []
            }
            habit_logs: {
                Row: {
                    created_at: string | null
                    date: string
                    entry_type: string | null
                    habit_id: string
                    id: string
                    notes: string | null
                    time_minutes: number | null
                    value: number
                }
                Insert: {
                    created_at?: string | null
                    date: string
                    entry_type?: string | null
                    habit_id: string
                    id?: string
                    notes?: string | null
                    time_minutes?: number | null
                    value?: number
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    entry_type?: string | null
                    habit_id?: string
                    id?: string
                    notes?: string | null
                    time_minutes?: number | null
                    value?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "habit_logs_habit_id_fkey"
                        columns: ["habit_id"]
                        isOneToOne: false
                        referencedRelation: "habits"
                        referencedColumns: ["id"]
                    },
                ]
            }
            habits: {
                Row: {
                    category: string
                    created_at: string | null
                    icon: string
                    id: string
                    input_type: string
                    is_active: boolean | null
                    name: string
                    sort_order: number
                    target_value: number | null
                    time_mode: string | null
                    unit: string | null
                }
                Insert: {
                    category?: string
                    created_at?: string | null
                    icon?: string
                    id?: string
                    input_type?: string
                    is_active?: boolean | null
                    name: string
                    sort_order?: number
                    target_value?: number | null
                    time_mode?: string | null
                    unit?: string | null
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    icon?: string
                    id?: string
                    input_type?: string
                    is_active?: boolean | null
                    name?: string
                    sort_order?: number
                    target_value?: number | null
                    time_mode?: string | null
                    unit?: string | null
                }
                Relationships: []
            }
            journal_entries: {
                Row: {
                    content: string
                    created_at: string | null
                    date: string
                    id: string
                    prompt_used: string | null
                    word_count: number | null
                }
                Insert: {
                    content?: string
                    created_at?: string | null
                    date: string
                    id?: string
                    prompt_used?: string | null
                    word_count?: number | null
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    date?: string
                    id?: string
                    prompt_used?: string | null
                    word_count?: number | null
                }
                Relationships: []
            }
            leads: {
                Row: {
                    company: string
                    contact: string
                    created_at: string | null
                    id: string
                    industry: string
                    stage: string
                    value: number
                }
                Insert: {
                    company: string
                    contact?: string
                    created_at?: string | null
                    id?: string
                    industry?: string
                    stage?: string
                    value?: number
                }
                Update: {
                    company?: string
                    contact?: string
                    created_at?: string | null
                    id?: string
                    industry?: string
                    stage?: string
                    value?: number
                }
                Relationships: []
            }
            transactions: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    date: string
                    description: string
                    id: string
                    type: string
                }
                Insert: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date: string
                    description?: string
                    id?: string
                    type: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date?: string
                    description?: string
                    id?: string
                    type?: string
                }
                Relationships: []
            }
            user_profile: {
                Row: {
                    created_at: string | null
                    display_name: string
                    email: string | null
                    full_name: string
                    id: string
                    phone: string | null
                    timezone: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    display_name?: string
                    email?: string | null
                    full_name?: string
                    id?: string
                    phone?: string | null
                    timezone?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    display_name?: string
                    email?: string | null
                    full_name?: string
                    id?: string
                    phone?: string | null
                    timezone?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            workouts: {
                Row: {
                    created_at: string | null
                    date: string
                    duration_minutes: number
                    id: string
                    notes: string | null
                    type: string
                }
                Insert: {
                    created_at?: string | null
                    date: string
                    duration_minutes?: number
                    id?: string
                    notes?: string | null
                    type?: string
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    duration_minutes?: number
                    id?: string
                    notes?: string | null
                    type?: string
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
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
}
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
}
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
}
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
