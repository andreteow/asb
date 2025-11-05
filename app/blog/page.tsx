import Link from "next/link"
import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Sanctuary Stories | TTE Elephant",
  description:
    "Read the latest stories from TTE Elephant Sanctuary, including conservation updates, culinary explorations, and mindful travel reflections.",
}

export default function BlogIndexPage() {
  return (
    <main className="bg-[#06110d] text-white">
      <section className="border-b border-white/10 bg-[#0b1f1a]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Sanctuary Stories</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Field notes from the heart of the sanctuary</h1>
          <p className="mt-6 text-sm text-white/70 sm:text-base">
            Our caretakers, conservationists, and culinary artisans share monthly reflections so you can follow every milestone in
            the herd&apos;s journey and behind-the-scenes stewardship.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[#97f2c4]">{post.category}</p>
                <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
                <p className="text-sm text-white/70">{post.excerpt}</p>
              </div>
              <div className="mt-10 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>{post.date}</span>
                <span>{post.author}</span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex text-sm font-semibold text-[#97f2c4] transition hover:text-white"
                prefetch={false}
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
