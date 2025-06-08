import type { Entity } from "./types"
import { getSupabase } from "./supabase"
import { slugify } from "./utils"

// Function to fetch entities from Supabase
export async function getEntities({
  query = "",
  entityType = "all",
  sector,
  location,
  page = 1,
  limit = 1000, // Default to large limit to get all results
}: {
  query?: string
  entityType?: string
  sector?: string
  location?: string
  page?: number
  limit?: number
}): Promise<{ entities: Entity[]; total: number; totalPages: number }> {
  try {
    const supabase = getSupabase()

    // If Supabase is not available, fall back to mock data
    if (!supabase) {
      console.log("Supabase not available, using mock data")
      return getMockData(query, entityType, sector, location, page, limit)
    }

    // Start building the query
    let supabaseQuery = supabase.from("entities").select("*", { count: "exact" }).eq("approved", true)

    // Filter by entity type
    if (entityType !== "all") {
      supabaseQuery = supabaseQuery.eq("entity_type", entityType)
    }

    // Filter by search query
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,industry_sector.ilike.%${query}%,hq_location.ilike.%${query}%,impact.ilike.%${query}%,problem_solved.ilike.%${query}%,target_beneficiaries.ilike.%${query}%`,
      )
    }

    // Filter by sector
    if (sector) {
      supabaseQuery = supabaseQuery.ilike("industry_sector", `%${sector}%`)
    }

    // Filter by location
    if (location) {
      supabaseQuery = supabaseQuery.ilike("hq_location", `%${location}%`)
    }

    // Add pagination (but with large limit to get all results)
    const from = (page - 1) * limit
    const to = from + limit - 1
    supabaseQuery = supabaseQuery.range(from, to).order("name")

    // Execute the query
    const { data, error, count } = await supabaseQuery

    if (error) {
      console.error("Error fetching entities:", error)
      return { entities: [], total: 0, totalPages: 0 }
    }

    // Transform the data to match our Entity type
    const entities: Entity[] = data.map((item) => ({
      id: item.id,
      entity_type: item.entity_type,
      name: item.name,
      slug: item.slug,
      website: item.website,
      description: item.description,
      hq_location: item.hq_location || undefined,
      contact_email: item.contact_email || undefined,
      industry_sector: item.industry_sector || undefined,
      social_status: item.social_status || undefined,
      funding_stage: item.social_status || undefined,
      cheque_size_range: item.cheque_size_range || undefined,
      investment_thesis: item.investment_thesis || undefined,
      program_type: item.program_type || undefined,
      next_intake_date: item.next_intake_date || undefined,
      impact: item.impact || undefined,
      problem_solved: item.problem_solved || undefined,
      target_beneficiaries: item.target_beneficiaries || undefined,
      revenue_model: item.revenue_model || undefined,
      year_founded: item.year_founded || undefined,
      awards: item.awards || undefined,
      grants: item.grants || undefined,
      institutional_support: item.institutional_support || undefined,
      last_enriched: item.last_enriched || undefined,
      _claim_status: item.claim_status,
      _approved: item.approved,
    }))

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return { entities, total, totalPages }
  } catch (error) {
    console.error("Error in getEntities:", error)
    return getMockData(query, entityType, sector, location, page, limit)
  }
}

// Add a function to get mock data
function getMockData(
  query = "",
  entityType = "all",
  sector?: string,
  location?: string,
  page = 1,
  limit = 1000,
): Promise<{ entities: Entity[]; total: number; totalPages: number }> {
  return import("./mock-data").then(({ default: mockData }) => {
    let entities = [...mockData]

    // Filter by entity type
    if (entityType !== "all") {
      entities = entities.filter((entity) => entity.entity_type === entityType)
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      entities = entities.filter((entity) => {
        const searchableText = [entity.name, entity.description, entity.industry_sector, entity.hq_location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        return searchableText.includes(lowercaseQuery)
      })
    }

    // Filter by sector
    if (sector) {
      entities = entities.filter(
        (entity) => entity.industry_sector && entity.industry_sector.toLowerCase().includes(sector.toLowerCase()),
      )
    }

    // Filter by location
    if (location) {
      entities = entities.filter(
        (entity) => entity.hq_location && entity.hq_location.toLowerCase().includes(location.toLowerCase()),
      )
    }

    const total = entities.length
    const totalPages = Math.ceil(total / limit)

    // For single page display, don't slice the results
    if (limit >= 1000) {
      return { entities, total, totalPages: 1 }
    }

    const startIndex = (page - 1) * limit
    entities = entities.slice(startIndex, startIndex + limit)

    return { entities, total, totalPages }
  })
}

// Function to get entity by slug
export async function getEntityBySlug(slug: string): Promise<Entity | null> {
  console.log("getEntityBySlug called with slug:", slug)

  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, using mock data for slug:", slug)
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      const entity = mockData.find((e) => e.slug === slug) || null

      if (entity) {
        console.log("Found entity in mock data:", entity.name)
      } else {
        console.log("Entity not found in mock data for slug:", slug)
      }

      return entity
    }

    console.log("Querying Supabase for slug:", slug)
    const { data, error } = await supabase.from("entities").select("*").eq("slug", slug).eq("approved", true).single()

    if (error) {
      console.error("Supabase error:", error)
      if (error.code === "PGRST116") {
        console.log("No rows found, falling back to mock data")
        // Fall back to mock data if no rows found
        const mockDataModule = await import("./mock-data")
        const mockData = mockDataModule.default
        return mockData.find((e) => e.slug === slug) || null
      }
      throw error
    }

    if (!data) {
      console.log("No data returned from Supabase, falling back to mock data")
      // Fall back to mock data if no data
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      return mockData.find((e) => e.slug === slug) || null
    }

    console.log("Found entity in Supabase:", data.name)

    // Transform to Entity type
    const entity: Entity = {
      id: data.id,
      entity_type: data.entity_type,
      name: data.name,
      slug: data.slug,
      website: data.website,
      description: data.description,
      hq_location: data.hq_location || undefined,
      contact_email: data.contact_email || undefined,
      industry_sector: data.industry_sector || undefined,
      social_status: data.social_status || undefined,
      funding_stage: data.funding_stage || undefined,
      cheque_size_range: data.cheque_size_range || undefined,
      investment_thesis: data.investment_thesis || undefined,
      program_type: data.program_type || undefined,
      next_intake_date: data.next_intake_date || undefined,
      impact: data.impact || undefined,
      problem_solved: data.problem_solved || undefined,
      target_beneficiaries: data.target_beneficiaries || undefined,
      revenue_model: data.revenue_model || undefined,
      year_founded: data.year_founded || undefined,
      awards: data.awards || undefined,
      grants: data.grants || undefined,
      institutional_support: data.institutional_support || undefined,
      last_enriched: data.last_enriched || undefined,
      _claim_status: data.claim_status,
      _approved: data.approved,
    }

    // Fetch news items for this entity
    try {
      const { data: newsData } = await supabase
        .from("news_items")
        .select("*")
        .eq("entity_id", data.id)
        .order("published_date", { ascending: false })
        .limit(3)

      if (newsData && newsData.length > 0) {
        entity.news_link_list = newsData.map((item) => item.url)
      }
    } catch (newsError) {
      console.error("Error fetching news items:", newsError)
      // Continue without news items
    }

    return entity
  } catch (error) {
    console.error("Error in getEntityBySlug:", error)
    // Fall back to mock data
    try {
      console.log("Falling back to mock data due to error")
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      return mockData.find((e) => e.slug === slug) || null
    } catch (mockError) {
      console.error("Error loading mock data:", mockError)
      return null
    }
  }
}

// Function to get entity by ID (for backward compatibility)
export async function getEntityById(id: string): Promise<Entity | null> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, using mock data for ID:", id)
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      const entity = mockData.find((e) => e.id === id) || null

      if (entity) {
        console.log("Found entity in mock data:", entity.name)
      } else {
        console.log("Entity not found in mock data for ID:", id)
      }

      return entity
    }

    const { data, error } = await supabase.from("entities").select("*").eq("id", id).single()

    if (error || !data) {
      console.error("Error fetching entity by ID:", error)
      // Fall back to mock data if Supabase query fails
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      return mockData.find((e) => e.id === id) || null
    }

    // Transform to Entity type
    const entity: Entity = {
      id: data.id,
      entity_type: data.entity_type,
      name: data.name,
      slug: data.slug,
      website: data.website,
      description: data.description,
      hq_location: data.hq_location || undefined,
      contact_email: data.contact_email || undefined,
      industry_sector: data.industry_sector || undefined,
      social_status: data.social_status || undefined,
      funding_stage: data.funding_stage || undefined,
      cheque_size_range: data.cheque_size_range || undefined,
      investment_thesis: data.investment_thesis || undefined,
      program_type: data.program_type || undefined,
      next_intake_date: data.next_intake_date || undefined,
      impact: data.impact || undefined,
      problem_solved: data.problem_solved || undefined,
      target_beneficiaries: data.target_beneficiaries || undefined,
      revenue_model: data.revenue_model || undefined,
      year_founded: data.year_founded || undefined,
      awards: data.awards || undefined,
      grants: data.grants || undefined,
      institutional_support: data.institutional_support || undefined,
      last_enriched: data.last_enriched || undefined,
      _claim_status: data.claim_status,
      _approved: data.approved,
    }

    // Fetch news items for this entity
    const { data: newsData } = await supabase
      .from("news_items")
      .select("*")
      .eq("entity_id", data.id)
      .order("published_date", { ascending: false })
      .limit(3)

    if (newsData && newsData.length > 0) {
      entity.news_link_list = newsData.map((item) => item.url)
    }

    return entity
  } catch (error) {
    console.error("Error in getEntityById:", error)
    // Fall back to mock data
    try {
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      return mockData.find((e) => e.id === id) || null
    } catch (mockError) {
      console.error("Error loading mock data:", mockError)
      return null
    }
  }
}

// Function to get similar entities
export async function getSimilarEntities(entityId: string, limit = 5): Promise<Entity[]> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, using mock data for similar entities")
      const mockDataModule = await import("./mock-data")
      const mockData = mockDataModule.default
      // Return a few random entities excluding the current one
      return mockData.filter((e) => e.id !== entityId).slice(0, limit)
    }

    // First, get the current entity
    const { data: currentEntityData, error: currentEntityError } = await supabase
      .from("entities")
      .select("*")
      .eq("id", entityId)
      .single()

    if (currentEntityError || !currentEntityData) {
      console.error("Error fetching current entity:", currentEntityError)
      return []
    }

    // Get all entities except the current one
    const { data: allEntities, error: allEntitiesError } = await supabase
      .from("entities")
      .select("*")
      .neq("id", entityId)
      .eq("approved", true)

    if (allEntitiesError || !allEntities) {
      console.error("Error fetching all entities:", allEntitiesError)
      return []
    }

    // Calculate similarity scores
    const entitiesWithScores = allEntities.map((entity) => ({
      entity,
      score: calculateSimilarityScore(currentEntityData, entity),
    }))

    // Sort by score and take the top 'limit' entities
    const similarEntities = entitiesWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        id: item.entity.id,
        entity_type: item.entity.entity_type,
        name: item.entity.name,
        slug: item.entity.slug,
        website: item.entity.website,
        description: item.entity.description,
        hq_location: item.entity.hq_location || undefined,
        industry_sector: item.entity.industry_sector || undefined,
        _claim_status: item.entity.claim_status,
        _approved: item.entity.approved,
      }))

    return similarEntities
  } catch (error) {
    console.error("Error in getSimilarEntities:", error)
    return []
  }
}

// Helper function to calculate similarity between entities
function calculateSimilarityScore(entity1: any, entity2: any): number {
  let score = 0

  // Same sector gets high score
  if (entity1.industry_sector && entity2.industry_sector) {
    const sectors1 = entity1.industry_sector.split(",").map((s: string) => s.trim().toLowerCase())
    const sectors2 = entity2.industry_sector.split(",").map((s: string) => s.trim().toLowerCase())
    const commonSectors = sectors1.filter((s: string) => sectors2.includes(s))
    score += commonSectors.length * 3
  }

  // Same location gets medium score
  if (entity1.hq_location && entity2.hq_location && entity1.hq_location === entity2.hq_location) {
    score += 2
  }

  // Same funding stage gets small score
  if (entity1.funding_stage && entity2.funding_stage && entity1.funding_stage === entity2.funding_stage) {
    score += 1
  }

  // Same target beneficiaries gets medium score
  if (
    entity1.target_beneficiaries &&
    entity2.target_beneficiaries &&
    entity1.target_beneficiaries === entity2.target_beneficiaries
  ) {
    score += 2
  }

  return score
}

// Add the getFilterOptions function that handles the case when Supabase is not available
export async function getFilterOptions(): Promise<{ sectors: string[]; locations: string[] }> {
  try {
    const supabase = getSupabase()

    // If Supabase is not available, fall back to mock data
    if (!supabase) {
      console.log("Supabase not available, using mock filter options")
      return getMockFilterOptions()
    }

    // Get all approved entities
    const { data, error } = await supabase.from("entities").select("industry_sector, hq_location").eq("approved", true)

    if (error || !data) {
      console.error("Error fetching filter options:", error)
      return getMockFilterOptions()
    }

    const sectorsSet = new Set<string>()
    const locationsSet = new Set<string>()

    data.forEach((entity) => {
      if (entity.industry_sector) {
        entity.industry_sector.split(",").forEach((sector: string) => {
          sectorsSet.add(sector.trim())
        })
      }

      if (entity.hq_location) {
        locationsSet.add(entity.hq_location.trim())
      }
    })

    return {
      sectors: Array.from(sectorsSet).sort(),
      locations: Array.from(locationsSet).sort(),
    }
  } catch (error) {
    console.error("Error in getFilterOptions:", error)
    return getMockFilterOptions()
  }
}

// Add a function to get mock filter options
function getMockFilterOptions(): Promise<{ sectors: string[]; locations: string[] }> {
  return import("./mock-data").then(({ default: mockData }) => {
    const sectorsSet = new Set<string>()
    const locationsSet = new Set<string>()

    mockData.forEach((entity) => {
      if (entity.industry_sector) {
        entity.industry_sector.split(",").forEach((sector: string) => {
          sectorsSet.add(sector.trim())
        })
      }

      if (entity.hq_location) {
        locationsSet.add(entity.hq_location.trim())
      }
    })

    return {
      sectors: Array.from(sectorsSet).sort(),
      locations: Array.from(locationsSet).sort(),
    }
  })
}

// Function to submit an intro request
export async function submitIntroRequest(data: {
  entityId: string
  name: string
  email: string
  phone: string
  reason: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, simulating intro request submission")
      // Simulate success for demo purposes
      return { success: true }
    }

    const { error } = await supabase.from("intro_requests").insert({
      entity_id: data.entityId,
      requester_name: data.name,
      requester_email: data.email,
      requester_phone: data.phone,
      reason: data.reason,
      status: "pending",
    })

    if (error) {
      console.error("Error submitting intro request:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in submitIntroRequest:", error)
    return { success: false, error: error.message }
  }
}

// Function to submit a claim/edit request
export async function submitEntityEdit(data: {
  id?: string
  name: string
  entity_type: "social_enterprise" | "investor" | "ecosystem_builder"
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
  impact?: string
  problem_solved?: string
  target_beneficiaries?: string
  revenue_model?: string
  year_founded?: string
  awards?: string
  grants?: string
  institutional_support?: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, simulating entity edit submission")
      // Simulate success for demo purposes
      return { success: true, id: data.id || "mock-id" }
    }

    // Generate a slug from the name
    const slug = slugify(data.name)

    if (data.id) {
      // Update existing entity
      const { error } = await supabase
        .from("entities")
        .update({
          ...data,
          slug,
          updated_at: new Date().toISOString(),
          claim_status: "pending",
          approved: false,
        })
        .eq("id", data.id)

      if (error) {
        console.error("Error updating entity:", error)
        return { success: false, error: error.message }
      }

      return { success: true, id: data.id }
    } else {
      // Insert new entity
      const { data: insertedData, error } = await supabase
        .from("entities")
        .insert({
          ...data,
          slug,
          claim_status: "pending",
          approved: false,
        })
        .select()

      if (error) {
        console.error("Error inserting entity:", error)
        return { success: false, error: error.message }
      }

      return { success: true, id: insertedData?.[0]?.id }
    }
  } catch (error: any) {
    console.error("Error in submitEntityEdit:", error)
    return { success: false, error: error.message }
  }
}

// Function to bulk upload entities
export async function bulkUploadEntities(entities: any[]): Promise<{ success: number; errors: string[] }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, simulating bulk upload")
      return { success: entities.length, errors: [] }
    }

    const results = { success: 0, errors: [] as string[] }

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]

      try {
        // Validate required fields
        if (!entity.name || !entity.entity_type || !entity.website || !entity.description) {
          results.errors.push(`Row ${i + 1}: Missing required fields (name, entity_type, website, description)`)
          continue
        }

        // Generate slug
        const slug = slugify(entity.name)

        // Check if entity with same slug already exists
        const { data: existingEntity } = await supabase.from("entities").select("id").eq("slug", slug).single()

        if (existingEntity) {
          results.errors.push(`Row ${i + 1}: Organization "${entity.name}" already exists`)
          continue
        }

        // Insert entity
        const { error } = await supabase.from("entities").insert({
          ...entity,
          slug,
          claim_status: "unclaimed",
          approved: true, // Auto-approve bulk uploads
        })

        if (error) {
          results.errors.push(`Row ${i + 1}: ${error.message}`)
        } else {
          results.success++
        }
      } catch (error: any) {
        results.errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }

    return results
  } catch (error: any) {
    console.error("Error in bulkUploadEntities:", error)
    return { success: 0, errors: [error.message] }
  }
}

// Function to log an update action
export async function logUpdate(data: {
  action: "update" | "news_refresh" | "approve" | "reject"
  details: string
  duration: string
  userId?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, cannot log update")
      return { success: false, error: "Supabase not available" }
    }

    const { error } = await supabase.from("update_logs").insert({
      action: data.action,
      details: data.details,
      duration: data.duration,
      user_id: data.userId || null,
    })

    if (error) {
      console.error("Error logging update:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in logUpdate:", error)
    return { success: false, error: error.message }
  }
}

// Function to get pending entities
export async function getPendingEntities(): Promise<Entity[]> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, using mock pending entities")
      // Return mock pending entities
      const mockDataModule = await import("./mock-data")
      return mockDataModule.mockPendingEntities.map((entity: any) => ({
        ...entity,
        _claim_status: "pending",
        _approved: false,
      }))
    }

    const { data, error } = await supabase
      .from("entities")
      .select("*")
      .eq("claim_status", "pending")
      .eq("approved", false)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching pending entities:", error)
      return []
    }

    // Transform to Entity type
    const entities: Entity[] = data.map((item) => ({
      id: item.id,
      entity_type: item.entity_type,
      name: item.name,
      slug: item.slug,
      website: item.website,
      description: item.description,
      hq_location: item.hq_location || undefined,
      contact_email: item.contact_email || undefined,
      industry_sector: item.industry_sector || undefined,
      social_status: item.social_status || undefined,
      funding_stage: item.funding_stage || undefined,
      cheque_size_range: item.cheque_size_range || undefined,
      investment_thesis: item.investment_thesis || undefined,
      program_type: item.program_type || undefined,
      next_intake_date: item.next_intake_date || undefined,
      impact: item.impact || undefined,
      problem_solved: item.problem_solved || undefined,
      target_beneficiaries: item.target_beneficiaries || undefined,
      revenue_model: item.revenue_model || undefined,
      year_founded: item.year_founded || undefined,
      awards: item.awards || undefined,
      grants: item.grants || undefined,
      institutional_support: item.institutional_support || undefined,
      last_enriched: item.last_enriched || undefined,
      _claim_status: item.claim_status,
      _approved: item.approved,
      submitted_at: item.updated_at,
    }))

    return entities
  } catch (error) {
    console.error("Error in getPendingEntities:", error)
    return []
  }
}

// Function to get update logs
export async function getUpdateLogs(limit = 20): Promise<any[]> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, using mock update logs")
      const mockDataModule = await import("./mock-data")
      return mockDataModule.mockUpdateLogs
    }

    const { data, error } = await supabase
      .from("update_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching update logs:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getUpdateLogs:", error)
    return []
  }
}

// Function to approve a pending entity
export async function approveEntity(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, simulating entity approval")
      return { success: true }
    }

    const { error } = await supabase
      .from("entities")
      .update({
        claim_status: "claimed",
        approved: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error approving entity:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in approveEntity:", error)
    return { success: false, error: error.message }
  }
}

// Function to reject a pending entity
export async function rejectEntity(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.log("Supabase not available, simulating entity rejection")
      return { success: true }
    }

    const { error } = await supabase
      .from("entities")
      .update({
        claim_status: "unclaimed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error rejecting entity:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in rejectEntity:", error)
    return { success: false, error: error.message }
  }
}
