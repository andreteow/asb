"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"
import { handleIntroRequest } from "@/app/actions"
import type { Entity } from "@/lib/types"

interface IntroRequestFormProps {
  entity: Entity
  onSuccess?: () => void
}

export function IntroRequestForm({ entity, onSuccess }: IntroRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("entityId", entity.id)
      formData.append("entityName", entity.name)

      const result = await handleIntroRequest(formData)

      if (result.success) {
        setToast({ message: "Introduction request sent successfully!", type: "success" })
        event.currentTarget.reset()
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      } else {
        setToast({ message: result.error || "Failed to send request", type: "error" })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setToast({ message: "An unexpected error occurred", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Your Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Your Phone Number</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Introduction</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Please explain why you'd like to be introduced to this organization"
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  )
}
