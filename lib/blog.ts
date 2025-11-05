export type BlogPost = {
  slug: string
  title: string
  date: string
  author: string
  category: string
  excerpt: string
  content: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "releasing-river-herd",
    title: "Releasing the River Herd Back to Gentle Waters",
    date: "January 12, 2025",
    author: "Dr. Maya Rahman",
    category: "Conservation",
    excerpt:
      "After months of hydrotherapy and trust-building, Asha and her companions took their first independent steps into the sanctuary river—here's how the team prepared for that moment.",
    content: [
      "Our river rehabilitation program is designed for elephants recovering from logging injuries. This season, Asha, Kelabu, and Puteri completed the final stage of hydrotherapy.",
      "Mahouts led sunrise walks to acclimatise them to the changing current, while veterinarians monitored muscle recovery and stress levels.",
      "On release day, guests were invited to observe quietly from our elevated deck as each elephant entered the water at their own pace, reinforcing our philosophy that choice belongs to the herd.",
      "The next phase involves slow foraging treks along the riverbank, where we reintroduce wild herbs and fruit trees nurtured by our horticulture team.",
    ],
  },
  {
    slug: "forest-foraging-calendar",
    title: "Inside Our Forest Foraging Calendar",
    date: "December 2, 2024",
    author: "Chef Nurul Adila",
    category: "Kitchen & Wellness",
    excerpt:
      "Our culinary team collaborates with botanists to design plant-forward menus for both humans and elephants. Explore the seasonal ingredients featured in every stay.",
    content: [
      "Each quarter we map edible flora within the 48-acre sanctuary, ensuring elephants graze on diverse, nutrient-dense plants.",
      "The same ingredients inspire our plant-based degustation menus—think turmeric-infused jackfruit rendang and torch ginger tonics.",
      "Guests can join our foraging walk to learn harvesting techniques that leave roots intact and soil undisturbed.",
      "We conclude the workshop with a community table experience overlooking the canopy, highlighting producers from nearby villages.",
    ],
  },
  {
    slug: "mindful-mahout-programme",
    title: "How the Mindful Mahout Programme Sustains Tradition",
    date: "November 10, 2024",
    author: "Ariff Iskandar",
    category: "Community",
    excerpt:
      "The Mindful Mahout Programme invests in the next generation through cultural apprenticeships, mindfulness training, and language exchange.",
    content: [
      "Fifteen apprentices completed the most recent programme, each paired with senior mahouts to learn compassionate handling techniques.",
      "Sessions include non-violent communication, breathwork, and somatic awareness so apprentices can recognise the herd's emotional cues.",
      "We also hosted storytelling nights with indigenous elders who shared ancestral knowledge about elephant migration routes.",
      "Graduates now guide our intimate guest experiences, ensuring the sanctuary's ethos is upheld with every interaction.",
    ],
  },
]
