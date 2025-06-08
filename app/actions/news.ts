"use server"

import { getSupabase } from "@/lib/supabase"

interface NewsItem {
  title: string
  summary: string
  url: string
  source: string
  publishedDate: string
  relevanceScore: number
}

export async function fetchTrendingNews(): Promise<{ success: boolean; error?: string; newsCount?: number }> {
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    // Call Grok AI to get trending news
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a news researcher specializing in social enterprises and nonprofits in Malaysia. Your task is to provide the top 10 trending news stories from the previous week about social enterprises, nonprofits, impact investing, and social innovation in Malaysia.

For each news item, provide:
1. Title (concise and descriptive)
2. Summary (2-3 sentences)
3. URL (if available, otherwise use a placeholder)
4. Source (news outlet name)
5. Published date (in YYYY-MM-DD format)
6. Relevance score (1-10, where 10 is most relevant)

Format your response as a JSON array with exactly 10 items. Each item should have the structure:
{
  "title": "News title",
  "summary": "Brief summary of the news",
  "url": "https://example.com/news-url",
  "source": "News Source Name",
  "publishedDate": "2024-01-15",
  "relevanceScore": 8
}

Focus on recent developments, funding announcements, policy changes, new initiatives, partnerships, and impact stories related to social enterprises and nonprofits in Malaysia.`,
          },
          {
            role: "user",
            content:
              "Please provide the top 10 trending news stories from the previous week about social enterprises and nonprofits in Malaysia.",
          },
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok AI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No content received from Grok AI")
    }

    // Parse the JSON response
    let newsItems: NewsItem[]
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : content
      newsItems = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("Failed to parse Grok AI response:", content)
      throw new Error("Failed to parse news data from Grok AI")
    }

    // Validate the response structure
    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      throw new Error("Invalid news data structure received from Grok AI")
    }

    // Store news items in Supabase
    const supabase = getSupabase()
    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    // Clear existing news items (optional - you might want to keep historical data)
    await supabase.from("news_items").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert new news items
    const newsItemsToInsert = newsItems.map((item) => ({
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source,
      published_date: item.publishedDate,
      relevance_score: item.relevanceScore,
      entity_id: null, // General news not tied to specific entity
      created_at: new Date().toISOString(),
    }))

    const { error: insertError } = await supabase.from("news_items").insert(newsItemsToInsert)

    if (insertError) {
      console.error("Error inserting news items:", insertError)
      throw new Error(`Failed to store news items: ${insertError.message}`)
    }

    return {
      success: true,
      newsCount: newsItems.length,
    }
  } catch (error: any) {
    console.error("Error fetching trending news:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch trending news",
    }
  }
}

export async function getLatestNews(limit = 10): Promise<NewsItem[]> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      // Return mock data if Supabase is not available
      return [
        {
          title: "Malaysian Social Enterprises Receive RM5M in New Funding",
          summary:
            "A consortium of social enterprises in Malaysia has secured RM5 million in funding to expand their impact programs across rural communities.",
          url: "#",
          source: "The Star",
          publishedDate: "2024-01-15",
          relevanceScore: 9,
        },
        {
          title: "Impact Investing Forum Highlights Growth in Southeast Asia",
          summary:
            "The annual Impact Investing Forum showcased significant growth in the sector, with Malaysia leading several innovative initiatives.",
          url: "#",
          source: "New Straits Times",
          publishedDate: "2024-01-14",
          relevanceScore: 8,
        },
      ]
    }

    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .is("entity_id", null) // Get general news items
      .order("published_date", { ascending: false })
      .order("relevance_score", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching news:", error)
      return []
    }

    return data.map((item) => ({
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source,
      publishedDate: item.published_date,
      relevanceScore: item.relevance_score,
    }))
  } catch (error) {
    console.error("Error in getLatestNews:", error)
    return []
  }
}
