export interface Database {
  public: {
    Tables: {
      e_fund: {
        Row: {
          f_id: string
          f_name: string
          f_it_id: string | null
          f_description: string | null
          f_linkedin_url: string | null
          f_domain: string | null
          f_first_cheque_minimum: number | null
          f_first_cheque_maximum: number | null
          f_data_sources: string[] | null
          f_source_confidence: number | null
          f_created_at: string | null
          f_updated_at: string | null
          f_website_text: string | null
          f_if_id: string | null
        }
        Insert: {
          f_id?: string
          f_name: string
          f_it_id?: string | null
          f_description?: string | null
          f_linkedin_url?: string | null
          f_domain?: string | null
          f_first_cheque_minimum?: number | null
          f_first_cheque_maximum?: number | null
          f_data_sources?: string[] | null
          f_source_confidence?: number | null
          f_created_at?: string | null
          f_updated_at?: string | null
          f_website_text?: string | null
          f_if_id?: string | null
        }
        Update: {
          f_id?: string
          f_name?: string
          f_it_id?: string | null
          f_description?: string | null
          f_linkedin_url?: string | null
          f_domain?: string | null
          f_first_cheque_minimum?: number | null
          f_first_cheque_maximum?: number | null
          f_data_sources?: string[] | null
          f_source_confidence?: number | null
          f_created_at?: string | null
          f_updated_at?: string | null
          f_website_text?: string | null
          f_if_id?: string | null
        }
      }
      e_f_lu_s: {
        Row: {
          fls_id: string
          fls_fund_id: string | null
          fls_stage_id: string | null
        }
        Insert: {
          fls_id?: string
          fls_fund_id?: string | null
          fls_stage_id?: string | null
        }
        Update: {
          fls_id?: string
          fls_fund_id?: string | null
          fls_stage_id?: string | null
        }
      }
      e_stage: {
        Row: {
          s_id: string
          s_name: string
          s_description: string | null
        }
        Insert: {
          s_id?: string
          s_name: string
          s_description?: string | null
        }
        Update: {
          s_id?: string
          s_name?: string
          s_description?: string | null
        }
      }
      e_ggt: {
        Row: {
          ggt_id: string
          ggt_name: string
          ggt_description: string | null
        }
        Insert: {
          ggt_id?: string
          ggt_name: string
          ggt_description?: string | null
        }
        Update: {
          ggt_id?: string
          ggt_name?: string
          ggt_description?: string | null
        }
      }
      e_f_lu_g: {
        Row: {
          flg_id: string
          flg_fund_id: string | null
          flg_ggt_id: string | null
        }
        Insert: {
          flg_id?: string
          flg_fund_id?: string | null
          flg_ggt_id?: string | null
        }
        Update: {
          flg_id?: string
          flg_fund_id?: string | null
          flg_ggt_id?: string | null
        }
      }
      e_investor_type: {
        Row: {
          it_id: string
          it_name: string
          it_description: string | null
        }
        Insert: {
          it_id?: string
          it_name: string
          it_description?: string | null
        }
        Update: {
          it_id?: string
          it_name?: string
          it_description?: string | null
        }
      }
      e_investment_fokus: {
        Row: {
          if_id: string
          if_name: string
          if_description: string | null
        }
        Insert: {
          if_id?: string
          if_name: string
          if_description?: string | null
        }
        Update: {
          if_id?: string
          if_name?: string
          if_description?: string | null
        }
      }
    }
  }
}

export type Fund = Database['public']['Tables']['e_fund']['Row']
export type Stage = Database['public']['Tables']['e_stage']['Row']
export type Theme = Database['public']['Tables']['e_ggt']['Row']
export type InvestorType = Database['public']['Tables']['e_investor_type']['Row']
export type InvestmentFocus = Database['public']['Tables']['e_investment_fokus']['Row']

export interface FundWithRelations extends Fund {
  stages?: Stage[]
  themes?: Theme[]
  investor_type?: InvestorType
  investment_focus?: InvestmentFocus
}
