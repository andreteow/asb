import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getEntityBySlug, getSimilarEntities } from "@/lib/data"
import { EntityNewsFeed } from "@/components/entity-news-feed"
import { IntroRequestButton } from "@/components/intro-request-button"

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  console.log("Looking for entity with slug:", params.slug)

  try {
    const entity = await getEntityBySlug(params.slug)
    console.log("Entity found:", entity ? entity.name : "null")

    if (!entity) {
      console.log("Entity not found, calling notFound()")
      notFound()
    }

    const similarEntities = await getSimilarEntities(entity.id, 5)

    const entityTypeLabel = {
      social_enterprise: "Social Enterprise",
      investor: "Investor",
      ecosystem_builder: "Ecosystem Builder",
    }[entity.entity_type]

    return (
      <main>
        <div className="bg-primary-700 py-8 text-white">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-sm text-primary-200 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to directory
              </Link>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">{entity.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary-400 text-white">
                {entityTypeLabel}
              </Badge>
              {entity.hq_location && (
                <Badge variant="outline" className="border-primary-400 text-white">
                  {entity.hq_location}
                </Badge>
              )}
              {entity._claim_status === "pending" && (
                <Badge variant="outline" className="border-yellow-400 bg-yellow-500/20 text-yellow-100">
                  ⏳ Pending
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="mb-6 rounded-lg border border-primary-100 bg-card p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{entity.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary-200 text-primary-700 hover:bg-primary-50"
                    >
                      <Link href={`/add?id=${entity.id}`}>Claim / Edit</Link>
                    </Button>
                    <IntroRequestButton entity={entity} />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-medium text-primary-700">Quick Facts</h3>
                    <dl className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                      <dt className="font-medium text-muted-foreground">Website:</dt>
                      <dd>
                        <a
                          href={entity.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-700 hover:underline"
                        >
                          {entity.website.replace(/^https?:\/\/(www\.)?/, "")}
                        </a>
                      </dd>

                      {entity.contact_email && (
                        <>
                          <dt className="font-medium text-muted-foreground">Contact:</dt>
                          <dd>
                            <a href={`mailto:${entity.contact_email}`} className="text-primary-700 hover:underline">
                              {entity.contact_email}
                            </a>
                          </dd>
                        </>
                      )}

                      {entity.industry_sector && (
                        <>
                          <dt className="font-medium text-muted-foreground">Sector:</dt>
                          <dd>{entity.industry_sector}</dd>
                        </>
                      )}

                      {entity.hq_location && (
                        <>
                          <dt className="font-medium text-muted-foreground">Location:</dt>
                          <dd>{entity.hq_location}</dd>
                        </>
                      )}

                      {entity.year_founded && entity.year_founded !== "-" && (
                        <>
                          <dt className="font-medium text-muted-foreground">Founded:</dt>
                          <dd>{entity.year_founded}</dd>
                        </>
                      )}

                      {entity.social_status && entity.social_status !== "-" && (
                        <>
                          <dt className="font-medium text-muted-foreground">Status:</dt>
                          <dd>{entity.social_status}</dd>
                        </>
                      )}

                      {entity.target_beneficiaries && entity.target_beneficiaries !== "-" && (
                        <>
                          <dt className="font-medium text-muted-foreground">Beneficiaries:</dt>
                          <dd>{entity.target_beneficiaries}</dd>
                        </>
                      )}

                      {entity.revenue_model && entity.revenue_model !== "-" && (
                        <>
                          <dt className="font-medium text-muted-foreground">Revenue Model:</dt>
                          <dd>{entity.revenue_model}</dd>
                        </>
                      )}

                      {/* Social Enterprise specific fields */}
                      {entity.entity_type === "social_enterprise" &&
                        entity.funding_stage &&
                        entity.funding_stage !== "-" && (
                          <>
                            <dt className="font-medium text-muted-foreground">Funding Stage:</dt>
                            <dd>{entity.funding_stage}</dd>
                          </>
                        )}

                      {/* Investor specific fields */}
                      {entity.entity_type === "investor" &&
                        entity.cheque_size_range &&
                        entity.cheque_size_range !== "-" && (
                          <>
                            <dt className="font-medium text-muted-foreground">Cheque Size:</dt>
                            <dd>{entity.cheque_size_range}</dd>
                          </>
                        )}

                      {/* Ecosystem Builder specific fields */}
                      {entity.entity_type === "ecosystem_builder" &&
                        entity.program_type &&
                        entity.program_type !== "-" && (
                          <>
                            <dt className="font-medium text-muted-foreground">Program Type:</dt>
                            <dd>{entity.program_type}</dd>
                          </>
                        )}

                      {entity.entity_type === "ecosystem_builder" &&
                        entity.next_intake_date &&
                        entity.next_intake_date !== "-" && (
                          <>
                            <dt className="font-medium text-muted-foreground">Next Intake:</dt>
                            <dd>{new Date(entity.next_intake_date).toLocaleDateString()}</dd>
                          </>
                        )}
                    </dl>
                  </div>

                  <div className="space-y-4">
                    {entity.problem_solved && entity.problem_solved !== "-" && (
                      <div>
                        <h3 className="mb-2 font-medium text-primary-700">Problem They Solve</h3>
                        <p className="text-sm text-muted-foreground">{entity.problem_solved}</p>
                      </div>
                    )}

                    {entity.impact && entity.impact !== "-" && (
                      <div>
                        <h3 className="mb-2 font-medium text-primary-700">Impact</h3>
                        <p className="text-sm text-muted-foreground">{entity.impact}</p>
                      </div>
                    )}

                    {entity.entity_type === "investor" &&
                      entity.investment_thesis &&
                      entity.investment_thesis !== "-" && (
                        <div>
                          <h3 className="mb-2 font-medium text-primary-700">Investment Thesis</h3>
                          <p className="text-sm text-muted-foreground">{entity.investment_thesis}</p>
                        </div>
                      )}
                  </div>
                </div>

                {(entity.awards && entity.awards !== "-") ||
                (entity.grants && entity.grants !== "-") ||
                (entity.institutional_support && entity.institutional_support !== "-") ? (
                  <div className="mt-6 border-t border-primary-100 pt-6">
                    <h3 className="mb-3 font-medium text-primary-700">Recognition & Support</h3>
                    <dl className="grid gap-4 text-sm md:grid-cols-2">
                      {entity.awards && entity.awards !== "-" && (
                        <div>
                          <dt className="font-medium text-muted-foreground mb-1">Awards:</dt>
                          <dd>{entity.awards}</dd>
                        </div>
                      )}

                      {entity.grants && entity.grants !== "-" && (
                        <div>
                          <dt className="font-medium text-muted-foreground mb-1">Grants:</dt>
                          <dd>{entity.grants}</dd>
                        </div>
                      )}

                      {entity.institutional_support && entity.institutional_support !== "-" && (
                        <div className="md:col-span-2">
                          <dt className="font-medium text-muted-foreground mb-1">Institutional Support:</dt>
                          <dd>{entity.institutional_support}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ) : null}

                {/* Add metadata section */}
                <div className="mt-6 border-t border-primary-100 pt-6">
                  <h3 className="mb-3 font-medium text-primary-700">Additional Information</h3>
                  <dl className="grid gap-2 text-sm md:grid-cols-2">
                    {entity.last_enriched && (
                      <div>
                        <dt className="font-medium text-muted-foreground">Last Updated:</dt>
                        <dd>{new Date(entity.last_enriched).toLocaleDateString()}</dd>
                      </div>
                    )}

                    <div>
                      <dt className="font-medium text-muted-foreground">Profile Status:</dt>
                      <dd>
                        {entity._claim_status === "claimed" && <span className="text-green-600">✓ Verified</span>}
                        {entity._claim_status === "pending" && (
                          <span className="text-yellow-600">⏳ Pending Verification</span>
                        )}
                        {entity._claim_status === "unclaimed" && <span className="text-gray-600">Unverified</span>}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {entity.news_link_list && entity.news_link_list.length > 0 && (
                <Card className="border-primary-100">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-medium text-primary-700">Latest News</h3>
                    <EntityNewsFeed newsLinks={entity.news_link_list} />
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="border-primary-100">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-medium text-primary-700">Similar Organizations</h3>
                  {similarEntities.length > 0 ? (
                    <div className="space-y-4">
                      {similarEntities.map((similarEntity) => (
                        <div key={similarEntity.id} className="border border-primary-100 rounded-lg p-3">
                          <Link
                            href={`/profile/${similarEntity.slug || similarEntity.id}`}
                            className="block hover:bg-primary-50 rounded p-2 -m-2"
                          >
                            <h4 className="font-medium text-sm mb-1">{similarEntity.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {similarEntity.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {similarEntity.industry_sector
                                ?.split(",")
                                .slice(0, 2)
                                .map((sector, i) => (
                                  <Badge key={i} variant="secondary" className="bg-primary-50 text-primary-700 text-xs">
                                    {sector.trim()}
                                  </Badge>
                                ))}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No similar organizations found at the moment.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in ProfilePage:", error)
    notFound()
  }
}
