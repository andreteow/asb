"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toast } from "@/components/ui/toast"
import { handleEntitySubmission } from "@/app/actions/entities"

interface AddEntityFormProps {
  initialData?: any
  onSubmit?: (data: any) => void
  isLoading?: boolean
  isEditing?: boolean
}

export function AddEntityForm({ initialData, onSubmit, isLoading = false, isEditing = false }: AddEntityFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    entity_type: initialData?.entity_type || "social_enterprise",
    website: initialData?.website || "",
    description: initialData?.description || "",
    hq_location: initialData?.hq_location || "",
    industry_sector: initialData?.industry_sector || "",
    contact_email: initialData?.contact_email || "",
    funding_stage: initialData?.funding_stage || "",
    cheque_size_range: initialData?.cheque_size_range || "",
    investment_thesis: initialData?.investment_thesis || "",
    program_type: initialData?.program_type || "",
    next_intake_date: initialData?.next_intake_date || "",
    impact: initialData?.impact || "",
    problem_solved: initialData?.problem_solved || "",
    target_beneficiaries: initialData?.target_beneficiaries || "",
    revenue_model: initialData?.revenue_model || "",
    year_founded: initialData?.year_founded || "",
    awards: initialData?.awards || "",
    grants: initialData?.grants || "",
    institutional_support: initialData?.institutional_support || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If there's a custom onSubmit handler (for the mock flow), use it
    if (onSubmit) {
      onSubmit(formData)
      return
    }

    // Otherwise, use the real server action
    setIsSubmitting(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataObj.append(key, value.toString())
        }
      })

      console.log("Submitting form with data:", formData)

      const result = await handleEntitySubmission(formDataObj)

      if (result.success) {
        setToast({
          message: result.message || "Organization submitted successfully!",
          type: "success",
        })

        // Reset form after successful submission
        setTimeout(() => {
          window.location.href = "/?submitted=true"
        }, 2000)
      } else {
        setToast({
          message: result.error || "Failed to submit organization",
          type: "error",
        })
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setToast({
        message: error.message || "An unexpected error occurred",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isEditing}
              className={isEditing ? "bg-gray-100" : ""}
            />
            {isEditing && <p className="text-xs text-muted-foreground">Organization name cannot be changed</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity_type">Organization Type *</Label>
            <Select
              value={formData.entity_type}
              onValueChange={(value) => handleSelectChange("entity_type", value)}
              required
            >
              <SelectTrigger id="entity_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social_enterprise">Social Enterprise</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="ecosystem_builder">Ecosystem Builder</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="website">Website *</Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hq_location">Headquarters Location</Label>
            <Input id="hq_location" name="hq_location" value={formData.hq_location} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry_sector">Industry/Sector</Label>
            <Input
              id="industry_sector"
              name="industry_sector"
              value={formData.industry_sector}
              onChange={handleChange}
              placeholder="e.g., Education, Healthcare, Environment"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="year_founded">Year Founded</Label>
            <Input
              id="year_founded"
              name="year_founded"
              value={formData.year_founded}
              onChange={handleChange}
              placeholder="e.g., 2020"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_beneficiaries">Target Beneficiaries</Label>
            <Input
              id="target_beneficiaries"
              name="target_beneficiaries"
              value={formData.target_beneficiaries}
              onChange={handleChange}
              placeholder="e.g., Youth, Women, Rural Communities"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="impact">Impact</Label>
          <Textarea
            id="impact"
            name="impact"
            rows={3}
            value={formData.impact}
            onChange={handleChange}
            placeholder="Describe the impact your organization creates"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="problem_solved">Problem Solved</Label>
          <Textarea
            id="problem_solved"
            name="problem_solved"
            rows={3}
            value={formData.problem_solved}
            onChange={handleChange}
            placeholder="Describe the problem your organization addresses"
          />
        </div>

        {formData.entity_type === "social_enterprise" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="funding_stage">Funding Stage</Label>
              <Select
                value={formData.funding_stage}
                onValueChange={(value) => handleSelectChange("funding_stage", value)}
              >
                <SelectTrigger id="funding_stage">
                  <SelectValue placeholder="Select funding stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Idea">Idea</SelectItem>
                  <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B+">Series B+</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue_model">Revenue Model</Label>
              <Input
                id="revenue_model"
                name="revenue_model"
                value={formData.revenue_model}
                onChange={handleChange}
                placeholder="e.g., Product Sales, Service Fees, Subscriptions"
              />
            </div>
          </>
        )}

        {formData.entity_type === "investor" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cheque_size_range">Cheque Size Range</Label>
              <Input
                id="cheque_size_range"
                name="cheque_size_range"
                value={formData.cheque_size_range}
                onChange={handleChange}
                placeholder="e.g., USD 50k-500k"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_thesis">Investment Thesis</Label>
              <Textarea
                id="investment_thesis"
                name="investment_thesis"
                rows={3}
                value={formData.investment_thesis}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {formData.entity_type === "ecosystem_builder" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program_type">Program Type</Label>
              <Select
                value={formData.program_type}
                onValueChange={(value) => handleSelectChange("program_type", value)}
              >
                <SelectTrigger id="program_type">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accelerator">Accelerator</SelectItem>
                  <SelectItem value="Incubator">Incubator</SelectItem>
                  <SelectItem value="Grant Program">Grant Program</SelectItem>
                  <SelectItem value="Coworking Space">Coworking Space</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_intake_date">Next Intake Date</Label>
              <Input
                id="next_intake_date"
                name="next_intake_date"
                type="date"
                value={formData.next_intake_date}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="awards">Awards</Label>
            <Input
              id="awards"
              name="awards"
              value={formData.awards}
              onChange={handleChange}
              placeholder="Any awards received"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grants">Grants</Label>
            <Input
              id="grants"
              name="grants"
              value={formData.grants}
              onChange={handleChange}
              placeholder="Any grants received"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutional_support">Institutional Support</Label>
            <Input
              id="institutional_support"
              name="institutional_support"
              value={formData.institutional_support}
              onChange={handleChange}
              placeholder="Any institutional support"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Profile"
        )}
      </Button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  )
}
