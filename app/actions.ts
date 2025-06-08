"use server"

import { submitIntroRequest } from "@/lib/data"
import { sendIntroRequestEmail } from "@/lib/email"

export async function handleIntroRequest(formData: FormData) {
  const entityId = formData.get("entityId") as string
  const entityName = formData.get("entityName") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const reason = formData.get("reason") as string

  if (!entityId || !entityName || !name || !email || !phone || !reason) {
    return { success: false, error: "All fields are required" }
  }

  try {
    // Save to database
    const dbResult = await submitIntroRequest({
      entityId,
      name,
      email,
      phone,
      reason,
    })

    if (!dbResult.success) {
      return dbResult
    }

    // Send emails
    const emailResult = await sendIntroRequestEmail({
      entityName,
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone,
      reason,
    })

    return emailResult
  } catch (error: any) {
    console.error("Error in handleIntroRequest:", error)
    return { success: false, error: error.message }
  }
}
