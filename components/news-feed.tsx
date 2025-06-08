"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"

interface NewsItem {
  title: string
  summary: string
  url: string
  source: string
  publishedDate: string
  relevanceScore: number
}

export function NewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      const news = await getLatestNews(4) // Get top 4 for the sidebar
      setNewsItems(news)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching news:", error)
      // Fallback to static news items
      setNewsItems([
        {
          title: "Malaysian Social Enterprises Receive RM5M in New Funding",
          summary:
            "A consortium of social enterprises in Malaysia has secured RM5 million in funding to expand their impact programs.",
          url: "#",
          source: "The Star",
          publishedDate: "2024-01-15",
          relevanceScore: 9,
        },
        {
          title: "Impact Investing Forum Highlights Growth in Southeast Asia",
          summary:
            "The annual Impact Investing Forum showcased significant growth in the sector, with Malaysia leading several initiatives.",
          url: "#",
          source: "New Straits Times",
          publishedDate: "2024-01-14",
          relevanceScore: 8,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()

    // Listen for news refresh events from admin panel
    const handleNewsRefresh = () => {
      fetchNews()
    }

    window.addEventListener("newsRefreshed", handleNewsRefresh)
    return () => window.removeEventListener("newsRefreshed", handleNewsRefresh)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return "1 week ago"
    return `${Math.floor(diffDays / 7)} weeks ago`
  }

  if (loading) {
    return (
      <Card className="border-primary-100">
        <CardHeader className="border-b border-primary-100 pb-3">
          <CardTitle className="text-lg text-primary-700 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading News...
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary-100">
      <CardHeader className="border-b border-primary-100 pb-3">
        <CardTitle className="text-lg text-primary-700">Latest News</CardTitle>
        {lastRefresh && (
          <p className="text-xs text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4">
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-primary-100 p-3 transition-colors hover:bg-primary-50"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-md bg-primary-100 p-1">
                  <Newspaper className="h-4 w-4 text-primary-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="line-clamp-2 text-sm font-medium">{item.title}</h4>
                    {item.url !== "#" && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  {item.summary && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.summary}</p>}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{formatDate(item.publishedDate)}</span>
                    {item.relevanceScore && (
                      <>
                        <span>•</span>
                        <span className="text-primary-600 font-medium">Score: {item.relevanceScore}/10</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
