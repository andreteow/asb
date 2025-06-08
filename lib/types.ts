export interface Entity {
  id: string
  entity_type: "social_enterprise" | "investor" | "ecosystem_builder"
  name: string
  website: string
  description: string
  hq_location?: string
  contact_email?: string
  industry_sector?: string
  social_status?: string
  funding_stage?: string
  cheque_size_range?: string
  investment_thesis?: string
  program_type?: string
  next_intake_date?: string
  news_link_list?: string[]
  last_enriched?: string
  _claim_status?: "unclaimed" | "pending" | "claimed"
  _approved?: boolean

  // Additional fields from CSV
  impact?: string
  problem_solved?: string
  target_beneficiaries?: string
  revenue_model?: string
  year_founded?: string
  awards?: string
  grants?: string
  institutional_support?: string
}
