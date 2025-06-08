import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Entity } from "@/lib/types"

interface EntityCardProps {
  entity: Entity
}

export function EntityCard({ entity }: EntityCardProps) {
  const entityTypeLabel = {
    social_enterprise: "Social Enterprise",
    investor: "Investor",
    ecosystem_builder: "Ecosystem Builder",
  }[entity.entity_type]

  return (
    <Link href={`/profile/${entity.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-md hover:shadow-primary-200 cursor-pointer group">
        <CardContent className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-medium group-hover:text-primary-700 transition-colors">{entity.name}</h3>
            {entity._claim_status === "pending" && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                ⏳ Pending
              </Badge>
            )}
          </div>

          <div className="mb-3 flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
              {entityTypeLabel}
            </Badge>
            {entity.hq_location && (
              <Badge variant="outline" className="bg-slate-50">
                {entity.hq_location}
              </Badge>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">{entity.description}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between bg-muted/30 px-6 py-3">
          <div className="flex flex-wrap gap-1">
            {entity.industry_sector
              ?.split(",")
              .slice(0, 2)
              .map((sector, i) => (
                <Badge key={i} variant="secondary" className="bg-primary-50 text-primary-700">
                  {sector.trim()}
                </Badge>
              ))}
            {entity.industry_sector?.split(",").length > 2 && (
              <Badge variant="secondary" className="bg-primary-50 text-primary-700">
                +{entity.industry_sector.split(",").length - 2}
              </Badge>
            )}
          </div>

          <div className="text-xs font-medium text-primary-700 group-hover:underline flex items-center">
            View Profile
            <ExternalLink className="ml-1 h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
