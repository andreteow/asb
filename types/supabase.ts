export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      entities: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          entity_type: "social_enterprise" | "investor" | "ecosystem_builder"
          website: string
          description: string
          hq_location: string | null
          contact_email: string | null
          industry_sector: string | null
          social_status: string | null
          funding_stage: string | null
          cheque_size_range: string | null
          investment_thesis: string | null
          program_type: string | null
          next_intake_date: string | null
          impact: string | null
          problem_solved: string | null
          target_beneficiaries: string | null
          revenue_model: string | null
          year_founded: string | null
          awards: string | null
          grants: string | null
          institutional_support: string | null
          claim_status: "unclaimed" | "pending" | "claimed"
          approved: boolean
          last_enriched: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          entity_type: "social_enterprise" | "investor" | "ecosystem_builder"
          website: string
          description: string
          hq_location?: string | null
          contact_email?: string | null
          industry_sector?: string | null
          social_status?: string | null
          funding_stage?: string | null
          cheque_size_range?: string | null
          investment_thesis?: string | null
          program_type?: string | null
          next_intake_date?: string | null
          impact?: string | null
          problem_solved?: string | null
          target_beneficiaries?: string | null
          revenue_model?: string | null
          year_founded?: string | null
          awards?: string | null
          grants?: string | null
          institutional_support?: string | null
          claim_status?: "unclaimed" | "pending" | "claimed"
          approved?: boolean
          last_enriched?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          entity_type?: "social_enterprise" | "investor" | "ecosystem_builder"
          website?: string
          description?: string
          hq_location?: string | null
          contact_email?: string | null
          industry_sector?: string | null
          social_status?: string | null
          funding_stage?: string | null
          cheque_size_range?: string | null
          investment_thesis?: string | null
          program_type?: string | null
          next_intake_date?: string | null
          impact?: string | null
          problem_solved?: string | null
          target_beneficiaries?: string | null
          revenue_model?: string | null
          year_founded?: string | null
          awards?: string | null
          grants?: string | null
          institutional_support?: string | null
          claim_status?: "unclaimed" | "pending" | "claimed"
          approved?: boolean
          last_enriched?: string | null
        }
      }
      news_items: {
        Row: {
          id: string
          created_at: string
          entity_id: string
          title: string
          url: string
          source: string
          published_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          entity_id: string
          title: string
          url: string
          source: string
          published_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          entity_id?: string
          title?: string
          url?: string
          source?: string
          published_date?: string | null
        }
      }
      intro_requests: {
        Row: {
          id: string
          created_at: string
          entity_id: string
          requester_name: string
          requester_email: string
          requester_phone: string
          reason: string
          status: "pending" | "approved" | "rejected"
        }
        Insert: {
          id?: string
          created_at?: string
          entity_id: string
          requester_name: string
          requester_email: string
          requester_phone: string
          reason: string
          status?: "pending" | "approved" | "rejected"
        }
        Update: {
          id?: string
          created_at?: string
          entity_id?: string
          requester_name?: string
          requester_email?: string
          requester_phone?: string
          reason?: string
          status?: "pending" | "approved" | "rejected"
        }
      }
      update_logs: {
        Row: {
          id: string
          created_at: string
          action: "update" | "news_refresh" | "approve" | "reject"
          details: string
          duration: string
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          action: "update" | "news_refresh" | "approve" | "reject"
          details: string
          duration: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          action?: "update" | "news_refresh" | "approve" | "reject"
          details?: string
          duration?: string
          user_id?: string | null
        }
      }
    }
  }
}
