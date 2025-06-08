import { ExternalLink } from "lucide-react"

interface EntityNewsFeedProps {
  newsLinks: string[]
}

export function EntityNewsFeed({ newsLinks }: EntityNewsFeedProps) {
  // Mock news data based on URLs
  const newsItems = newsLinks.map((url, index) => {
    // In a real implementation, you would fetch metadata for each URL
    // For now, we'll create mock data
    const domain = new URL(url).hostname.replace("www.", "")

    return {
      id: `news-${index}`,
      title: [
        "Company announces new sustainability initiative",
        "Partnership formed to address social challenges",
        "Funding secured for expansion into new markets",
      ][index % 3],
      source: domain,
      date: ["2 days ago", "1 week ago", "2 weeks ago"][index % 3],
      url,
    }
  })

  return (
    <div className="space-y-4">
      {newsItems.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <div>
            <h4 className="flex items-start justify-between text-sm font-medium">
              <span>{item.title}</span>
              <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0 text-muted-foreground" />
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
