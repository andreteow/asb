import type { Entity } from "./types"

// Real data from CSV will be loaded here
let realEntitiesData: Entity[] = []

// Function to fetch and transform CSV data
async function loadRealData(): Promise<Entity[]> {
  if (realEntitiesData.length > 0) {
    return realEntitiesData
  }

  try {
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mock%20Data%20-%20SE%202025%28Mock%20Data%20%28WiP%29%29-t4uPjoG9EiIYbH27WnhhsXn5CQd7P3.csv"
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const transformedEntities: Entity[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}

      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].replace(/"/g, "").trim() : ""
      })

      // Skip empty rows
      if (!row["Company Name"] || row["Company Name"] === "") continue

      // Transform to our Entity format
      const entity: Entity = {
        id: `se-${i}`,
        entity_type: "social_enterprise",
        name: row["Company Name"] || "",
        website: cleanWebsite(row["Website/Social Media"] || ""),
        description: createDescription(row),
        hq_location: row["Location"] || "",
        contact_email: "", // Not available in CSV
        industry_sector: row["Sector"] || "",
        social_status: row["MaGIC Accredited"] === "Yes" ? "MaGIC Accredited" : "Not Accredited",
        funding_stage: determineFundingStage(row),
        news_link_list: [],
        last_enriched: new Date().toISOString(),
        _claim_status: "unclaimed",
        _approved: true,
        // Additional fields from CSV
        impact: row["Impact"] || "",
        problem_solved: row["Problem They Solve"] || "",
        target_beneficiaries: row["Target Beneficiaries"] || "",
        revenue_model: row["Revenue Model"] || "",
        year_founded: row["Year Founded"] || "",
        awards: row["Awards"] || "",
        grants: row["Grants"] || "",
        institutional_support: row["Institutional Support"] || "",
      }

      transformedEntities.push(entity)
    }

    realEntitiesData = transformedEntities
    return transformedEntities
  } catch (error) {
    console.error("Error loading real data:", error)
    // Fallback to mock data if CSV fails to load
    return getMockData()
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function cleanWebsite(website: string): string {
  if (!website || website === "-" || website === "") return ""

  // Clean up website URL
  let cleaned = website.toLowerCase().trim()

  // Remove common prefixes if not present
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    if (cleaned.startsWith("www.")) {
      cleaned = "https://" + cleaned
    } else {
      cleaned = "https://www." + cleaned
    }
  }

  return cleaned
}

function createDescription(row: Record<string, string>): string {
  let description = row["What They Do"] || ""

  if (row["Impact"] && row["Impact"] !== "-") {
    description += ` ${row["Impact"]}.`
  }

  if (row["Problem They Solve"] && row["Problem They Solve"] !== "-") {
    description += ` They address ${row["Problem They Solve"].toLowerCase()}.`
  }

  if (row["Target Beneficiaries"] && row["Target Beneficiaries"] !== "-") {
    description += ` Their target beneficiaries are ${row["Target Beneficiaries"].toLowerCase()}.`
  }

  return description.trim()
}

function determineFundingStage(row: Record<string, string>): string {
  const yearFounded = row["Year Founded"]
  const hasGrants = row["Grants"] && row["Grants"] !== "-"
  const hasInstitutionalSupport = row["Institutional Support"] && row["Institutional Support"] !== "-"

  if (!yearFounded || yearFounded === "-") return "Unknown"

  const foundingYear = Number.parseInt(yearFounded)
  const currentYear = new Date().getFullYear()
  const age = currentYear - foundingYear

  if (age <= 1) return "Idea"
  if (age <= 3) return hasGrants || hasInstitutionalSupport ? "Seed" : "Pre-seed"
  if (age <= 5) return "Seed"
  return "Growth"
}

// Mock data as fallback
function getMockData(): Entity[] {
  return [
    {
      id: "1",
      entity_type: "social_enterprise",
      name: "EcoCycle Berhad",
      website: "https://example.com/ecocycle",
      description:
        "EcoCycle is a social enterprise focused on recycling and waste management solutions in urban areas.",
      hq_location: "Kuala Lumpur",
      contact_email: "info@ecocycle.example.com",
      industry_sector: "Waste Management, Environment",
      funding_stage: "Seed",
      last_enriched: "2023-05-15T08:30:00Z",
      news_link_list: [],
      _claim_status: "claimed",
      _approved: true,
    },
  ]
}

interface GetEntitiesParams {
  query?: string
  entityType?: string
  sector?: string
  location?: string
  page?: number
  limit?: number
}

export async function getEntities({
  query = "",
  entityType = "all",
  sector,
  location,
  page = 1,
  limit = 10,
}: GetEntitiesParams): Promise<{ entities: Entity[]; total: number; totalPages: number }> {
  // Load real data
  let allEntities = await loadRealData()

  // Filter by entity type
  if (entityType !== "all") {
    allEntities = allEntities.filter((entity) => entity.entity_type === entityType)
  }

  // Enhanced search - search across all relevant fields
  if (query) {
    const lowercaseQuery = query.toLowerCase()
    allEntities = allEntities.filter((entity) => {
      const searchableText = [
        entity.name,
        entity.description,
        entity.industry_sector,
        entity.hq_location,
        entity.impact,
        entity.problem_solved,
        entity.target_beneficiaries,
        entity.revenue_model,
        entity.awards,
        entity.grants,
        entity.institutional_support,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(lowercaseQuery)
    })
  }

  // Filter by sector
  if (sector) {
    allEntities = allEntities.filter(
      (entity) => entity.industry_sector && entity.industry_sector.toLowerCase().includes(sector.toLowerCase()),
    )
  }

  // Filter by location
  if (location) {
    allEntities = allEntities.filter(
      (entity) => entity.hq_location && entity.hq_location.toLowerCase().includes(location.toLowerCase()),
    )
  }

  const total = allEntities.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const entities = allEntities.slice(startIndex, startIndex + limit)

  return { entities, total, totalPages }
}

export async function getEntityById(id: string): Promise<Entity | null> {
  const allEntities = await loadRealData()
  const entity = allEntities.find((entity) => entity.id === id)
  return entity || null
}

// Helper function to get similar organizations
export async function getSimilarEntities(entityId: string, limit = 5): Promise<Entity[]> {
  const allEntities = await loadRealData()
  const currentEntity = allEntities.find((entity) => entity.id === entityId)

  if (!currentEntity) return []

  // Calculate similarity based on sector, location, and other factors
  const similarEntities = allEntities
    .filter((entity) => entity.id !== entityId)
    .map((entity) => ({
      entity,
      score: calculateSimilarityScore(currentEntity, entity),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entity)

  return similarEntities
}

function calculateSimilarityScore(entity1: Entity, entity2: Entity): number {
  let score = 0

  // Same sector gets high score
  if (entity1.industry_sector && entity2.industry_sector) {
    const sectors1 = entity1.industry_sector.split(",").map((s) => s.trim().toLowerCase())
    const sectors2 = entity2.industry_sector.split(",").map((s) => s.trim().toLowerCase())
    const commonSectors = sectors1.filter((s) => sectors2.includes(s))
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

// Helper function to get unique sectors and locations for filters
export async function getFilterOptions(): Promise<{ sectors: string[]; locations: string[] }> {
  const allEntities = await loadRealData()

  const sectorsSet = new Set<string>()
  const locationsSet = new Set<string>()

  allEntities.forEach((entity) => {
    if (entity.industry_sector) {
      entity.industry_sector.split(",").forEach((sector) => {
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
}
