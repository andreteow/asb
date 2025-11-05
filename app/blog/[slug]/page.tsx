import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { blogPosts } from "@/lib/blog"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const post = blogPosts.find((entry) => entry.slug === params.slug)

  if (!post) {
    return {
      title: "Story not found | TTE Elephant",
    }
  }

  return {
    title: `${post.title} | TTE Elephant`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((entry) => entry.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="bg-[#06110d] text-white">
      <article className="mx-auto max-w-3xl px-6 py-20">
        <Link href="/blog" className="text-xs uppercase tracking-[0.3em] text-[#97f2c4] hover:text-white" prefetch={false}>
          &larr; Back to stories
        </Link>
        <header className="mt-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-[#97f2c4]">{post.category}</span>
          <h1 className="text-4xl font-semibold sm:text-5xl">{post.title}</h1>
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">
            {post.date} • {post.author}
          </div>
        </header>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-white/80">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  )
}
