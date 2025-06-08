import { EntityCard } from "@/components/entity-card"
import { EntityTypeFilter } from "@/components/entity-type-filter"
import { RealTimeSearch } from "@/components/real-time-search"
import { CollapsibleFilterSidebar } from "@/components/collapsible-filter-sidebar"
import { NewsFeed } from "@/components/news-feed"
import { getEntities } from "@/lib/data"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.query === "string" ? searchParams.query : ""
  const entityType = typeof searchParams.type === "string" ? searchParams.type : "all"
  const sector = typeof searchParams.sector === "string" ? searchParams.sector : undefined
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined

  // Get all entities without pagination
  const { entities, total } = await getEntities({
    query,
    entityType,
    sector,
    location,
    page: 1,
    limit: 1000, // Large limit to get all results
  })

  return (
    <main className="flex min-h-screen flex-col">
      <div className="bg-primary-700 py-16 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/hero-bg.png')",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Malaysia&apos;s Impact Ecosystem Directory
            </h1>
            <p className="mt-4 text-xl text-primary-100">
              Connect with social enterprises, investors, and ecosystem builders making a difference
            </p>
            <div className="mt-8">
              <RealTimeSearch defaultValue={query} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <EntityTypeFilter activeType={entityType} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr_300px]">
          <div className="lg:block">
            <CollapsibleFilterSidebar />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {total} {total === 1 ? "Organization" : "Organizations"}
              </h2>
            </div>

            {entities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {entities.map((entity) => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No matches found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <NewsFeed />
          </div>
        </div>
      </div>
    </main>
  )
}
