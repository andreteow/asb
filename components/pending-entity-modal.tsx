"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Check, X, ExternalLink, Mail, Calendar, MapPin, Building, Users, DollarSign } from "lucide-react"
import type { Entity } from "@/lib/types"

interface PendingEntityModalProps {
  entity: Entity | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function PendingEntityModal({ entity, isOpen, onClose, onApprove, onReject }: PendingEntityModalProps) {
  if (!entity) return null

  const entityTypeLabel = {
    social_enterprise: "Social Enterprise",
    investor: "Investor",
    ecosystem_builder: "Ecosystem Builder",
  }[entity.entity_type]

  const handleApprove = () => {
    onApprove(entity.id)
    onClose()
  }

  const handleReject = () => {
    onReject(entity.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {entity.name}
            <Badge variant="outline" className="bg-primary-50 text-primary-700">
              {entityTypeLabel}
            </Badge>
          </DialogTitle>
          <DialogDescription>Review the details below to approve or reject this submission</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-3">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                  <p className="text-sm">{entity.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-sm">
                    <a
                      href={entity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-700 hover:underline inline-flex items-center gap-1"
                    >
                      {entity.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>

                {entity.contact_email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                    <p className="text-sm">
                      <a
                        href={`mailto:${entity.contact_email}`}
                        className="text-primary-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        {entity.contact_email}
                      </a>
                    </p>
                  </div>
                )}

                {entity.hq_location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {entity.hq_location}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {entity.industry_sector && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry/Sector</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.industry_sector.split(",").map((sector, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sector.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {entity.year_founded && entity.year_founded !== "-" && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                    <p className="text-sm inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entity.year_founded}
                    </p>
                  </div>
                )}

                {entity.social_status && entity.social_status !== "-" && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Social Status</label>
                    <p className="text-sm">{entity.social_status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{entity.description}</p>
          </div>

          <Separator />

          {/* Impact & Problem */}
          <div className="grid gap-6 md:grid-cols-2">
            {entity.problem_solved && entity.problem_solved !== "-" && (
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Problem They Solve</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{entity.problem_solved}</p>
              </div>
            )}

            {entity.impact && entity.impact !== "-" && (
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Impact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{entity.impact}</p>
              </div>
            )}
          </div>

          {entity.target_beneficiaries && entity.target_beneficiaries !== "-" && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Target Beneficiaries</h3>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {entity.target_beneficiaries}
                </p>
              </div>
            </>
          )}

          {/* Entity-specific sections */}
          {entity.entity_type === "social_enterprise" && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Social Enterprise Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {entity.funding_stage && entity.funding_stage !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Funding Stage</label>
                      <p className="text-sm">{entity.funding_stage}</p>
                    </div>
                  )}

                  {entity.revenue_model && entity.revenue_model !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Revenue Model</label>
                      <p className="text-sm inline-flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {entity.revenue_model}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {entity.entity_type === "investor" && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Investor Details</h3>
                <div className="space-y-4">
                  {entity.cheque_size_range && entity.cheque_size_range !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cheque Size Range</label>
                      <p className="text-sm inline-flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {entity.cheque_size_range}
                      </p>
                    </div>
                  )}

                  {entity.investment_thesis && entity.investment_thesis !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Investment Thesis</label>
                      <p className="text-sm text-muted-foreground leading-relaxed">{entity.investment_thesis}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {entity.entity_type === "ecosystem_builder" && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Ecosystem Builder Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {entity.program_type && entity.program_type !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Program Type</label>
                      <p className="text-sm inline-flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {entity.program_type}
                      </p>
                    </div>
                  )}

                  {entity.next_intake_date && entity.next_intake_date !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Next Intake Date</label>
                      <p className="text-sm inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entity.next_intake_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Recognition & Support */}
          {((entity.awards && entity.awards !== "-") ||
            (entity.grants && entity.grants !== "-") ||
            (entity.institutional_support && entity.institutional_support !== "-")) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium text-primary-700 mb-3">Recognition & Support</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {entity.awards && entity.awards !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Awards</label>
                      <p className="text-sm text-muted-foreground">{entity.awards}</p>
                    </div>
                  )}

                  {entity.grants && entity.grants !== "-" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Grants</label>
                      <p className="text-sm text-muted-foreground">{entity.grants}</p>
                    </div>
                  )}

                  {entity.institutional_support && entity.institutional_support !== "-" && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Institutional Support</label>
                      <p className="text-sm text-muted-foreground">{entity.institutional_support}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Submission Info */}
          <Separator />
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-3">Submission Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted At</label>
                <p className="text-sm">
                  {entity.submitted_at ? new Date(entity.submitted_at).toLocaleString() : "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Claim Status</label>
                <p className="text-sm">
                  {entity._claim_status === "pending" && "Pending Review"}
                  {entity._claim_status === "claimed" && "Claimed"}
                  {entity._claim_status === "unclaimed" && "Unclaimed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleReject} className="text-red-600 hover:text-red-700">
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
