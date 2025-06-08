"use server"

import { submitEntityEdit } from "@/lib/data"

export async function handleEntitySubmission(formData: FormData) {
  try {
    // Extract form data
    const entityData = {
      id: (formData.get("id") as string) || undefined,
      name: formData.get("name") as string,
      entity_type: formData.get("entity_type") as "social_enterprise" | "investor" | "ecosystem_builder",
      website: formData.get("website") as string,
      description: formData.get("description") as string,
      hq_location: (formData.get("hq_location") as string) || undefined,
      contact_email: (formData.get("contact_email") as string) || undefined,
      industry_sector: (formData.get("industry_sector") as string) || undefined,
      social_status: (formData.get("social_status") as string) || undefined,
      funding_stage: (formData.get("funding_stage") as string) || undefined,
      cheque_size_range: (formData.get("cheque_size_range") as string) || undefined,
      investment_thesis: (formData.get("investment_thesis") as string) || undefined,
      program_type: (formData.get("program_type") as string) || undefined,
      next_intake_date: (formData.get("next_intake_date") as string) || undefined,
      impact: (formData.get("impact") as string) || undefined,
      problem_solved: (formData.get("problem_solved") as string) || undefined,
      target_beneficiaries: (formData.get("target_beneficiaries") as string) || undefined,
      revenue_model: (formData.get("revenue_model") as string) || undefined,
      year_founded: (formData.get("year_founded") as string) || undefined,
      awards: (formData.get("awards") as string) || undefined,
      grants: (formData.get("grants") as string) || undefined,
      institutional_support: (formData.get("institutional_support") as string) || undefined,
    }

    // Validate required fields
    if (!entityData.name || !entityData.entity_type || !entityData.website || !entityData.description) {
      return {
        success: false,
        error: "Missing required fields: name, entity_type, website, and description are required",
      }
    }

    console.log("Submitting entity data:", entityData)

    // Submit to database
    const result = await submitEntityEdit(entityData)

    if (result.success) {
      console.log("Entity submitted successfully:", result.id)
      return {
        success: true,
        message:
          "Organization submitted successfully! It will be reviewed by our team and added to the directory once approved.",
        id: result.id,
      }
    } else {
      console.error("Failed to submit entity:", result.error)
      return {
        success: false,
        error: result.error || "Failed to submit organization",
      }
    }
  } catch (error: any) {
    console.error("Error in handleEntitySubmission:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    }
  }
}
