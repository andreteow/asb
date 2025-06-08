import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"

export function NewsFeed() {
  const newsItems = [
    {
      id: "1",
      title: "Malaysian Social Enterprises Receive RM5M in New Funding",
      source: "The Star",
      date: "2 days ago",
      url: "#",
    },
    {
      id: "2",
      title: "Impact Investing Forum Highlights Growth in Southeast Asia",
      source: "New Straits Times",
      date: "3 days ago",
      url: "#",
    },
    {
      id: "3",
      title: "New Accelerator Program Launches for Climate Tech Startups",
      source: "The Edge Markets",
      date: "5 days ago",
      url: "#",
    },
    {
      id: "4",
      title: "Social Enterprise Alliance Announces Annual Awards",
      source: "Malay Mail",
      date: "1 week ago",
      url: "#",
    },
  ]

  return (
    <Card className="border-primary-100">
      <CardHeader className="border-b border-primary-100 pb-3">
        <CardTitle className="text-lg text-primary-700">Latest News</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4">
        <div className="space-y-4">
          {newsItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="block rounded-lg border border-primary-100 p-3 transition-colors hover:bg-primary-50"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-md bg-primary-100 p-1">
                  <Newspaper className="h-4 w-4 text-primary-700" />
                </div>
                <div>
                  <h4 className="line-clamp-2 text-sm font-medium">{item.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.date}</span>
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
