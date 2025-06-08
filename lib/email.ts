import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_GpUvmVUU_MDEELYmVZ8AXtCVv1VkRrPaA")

export async function sendIntroRequestEmail(data: {
  entityName: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  reason: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email to admin
    const adminResponse = await resend.emails.send({
      from: "ASBhive <noreply@asbhive.my>",
      to: "andreteow01@gmail.com",
      subject: `${data.requesterName} has requested an intro to ${data.entityName}`,
      html: `
        <h2>Introduction Request</h2>
        <p><strong>Organization:</strong> ${data.entityName}</p>
        <p><strong>Requester Name:</strong> ${data.requesterName}</p>
        <p><strong>Requester Email:</strong> ${data.requesterEmail}</p>
        <p><strong>Requester Phone:</strong> ${data.requesterPhone}</p>
        <h3>Reason for Introduction:</h3>
        <p>${data.reason}</p>
      `,
    })

    if (adminResponse.error) {
      console.error("Error sending admin email:", adminResponse.error)
      return { success: false, error: adminResponse.error.message }
    }

    // Send confirmation email to requester
    const userResponse = await resend.emails.send({
      from: "ASBhive <noreply@asbhive.my>",
      to: data.requesterEmail,
      subject: `Request for introduction to ${data.entityName} submitted`,
      html: `
        <h2>Your Introduction Request</h2>
        <p>Thank you for your request to be introduced to ${data.entityName}.</p>
        <p>We have received your request with the following details:</p>
        <ul>
          <li><strong>Your Name:</strong> ${data.requesterName}</li>
          <li><strong>Your Email:</strong> ${data.requesterEmail}</li>
          <li><strong>Your Phone:</strong> ${data.requesterPhone}</li>
          <li><strong>Reason for Introduction:</strong> ${data.reason}</li>
        </ul>
        <p>You will receive news on your introduction request in the next 24 hours.</p>
        <p>Best regards,<br>ASBhive Team</p>
      `,
    })

    if (userResponse.error) {
      console.error("Error sending user confirmation email:", userResponse.error)
      return { success: false, error: userResponse.error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in sendIntroRequestEmail:", error)
    return { success: false, error: error.message }
  }
}
