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
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          selected_plan: string | null
          created_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          selected_plan?: string | null
          created_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          selected_plan?: string | null
          created_at?: string
          status?: string
          user_id?: string | null
        }
      }
    }
  }
}