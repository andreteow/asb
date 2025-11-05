import Link from "next/link"
import { blogPosts } from "@/lib/blog"

const experiences = [
  {
    title: "Sunrise Forest Walk",
    description:
      "Begin your day beside our mahouts as they guide you through misty rainforest trails and share the elephants' morning rituals.",
  },
  {
    title: "Mindful Bathing Ritual",
    description:
      "Participate in a gentle river bath while learning how we rehabilitate and care for our rescued herd with dignity and respect.",
  },
  {
    title: "Plant & Protect Workshop",
    description:
      "Join our conservationists to plant medicinal herbs, craft enrichment toys, and understand our habitat restoration work.",
  },
]

const retreatSuites = [
  {
    name: "Rainforest Villa",
    description:
      "A private, open-plan villa with panoramic jungle views, natural stone bathtub, and curated aromatherapy for deep rest.",
  },
  {
    name: "Riverstone Pavilion",
    description:
      "Nestled beside the sanctuary stream with floor-to-ceiling screens and a meditation deck for sunset yoga sessions.",
  },
  {
    name: "Canopy Residence",
    description:
      "Elevated treetop hideaway featuring handcrafted teak interiors, soundscapes, and a personal naturalist concierge.",
  },
]

const commitments = [
  {
    title: "Rescue & Rehabilitation",
    description:
      "Every stay funds veterinary care, nutritious diets, and expansive roaming spaces tailored to each elephant's healing journey.",
  },
  {
    title: "Community Partnerships",
    description:
      "We employ and train local mahouts, artisans, and growers to sustain livelihoods while preserving indigenous knowledge.",
  },
  {
    title: "Low-Impact Stays",
    description:
      "From solar-powered suites to zero-single-use amenities, our sanctuary is designed to protect the forest we call home.",
  },
]

const testimonials = [
  {
    quote:
      "The most transformative retreat we've experienced. The elephants are treated with such respect, and every detail is infused with heart.",
    name: "Aisha & Malik, Kuala Lumpur",
  },
  {
    quote:
      "We left feeling grounded, educated, and inspired. The mindful pacing and personal storytelling were unforgettable.",
    name: "Sophia, Singapore",
  },
]

const latestPosts = blogPosts.slice(0, 3)

export default function HomePage() {
  return (
    <main className="bg-[#06110d] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(151,242,196,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(8,40,30,0.85),_rgba(14,59,45,0.65))]" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24">
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#97f2c4]">
            TTE Elephant Sanctuary
          </span>
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Immersive stays that celebrate elephant wisdom and slow travel
            </h1>
            <p className="text-base text-white/70 sm:text-lg">
              Discover Malaysia&apos;s mindful eco-retreat where rescued elephants thrive. Stay in eco-luxury suites, share moments
              with our herd, and support conservation with every booking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#booking"
                className="rounded-full bg-[#97f2c4] px-6 py-3 text-sm font-semibold text-[#0b1f1a] shadow-lg shadow-[#97f2c4]/20 transition hover:bg-[#7edba7]"
              >
                Book your sanctuary stay
              </Link>
              <Link
                href="#experiences"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#97f2c4] hover:text-[#97f2c4]"
              >
                Explore guest experiences
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b1f1a]">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 text-center sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-[#97f2c4]">12</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Rescued Elephants</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-[#97f2c4]">48</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Acres of Protected Habitat</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-semibold text-[#97f2c4]">5%</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Of every booking funds rescue missions</p>
          </div>
        </div>
      </section>

      <section id="experiences" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Signature moments</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">Curated experiences designed around elephant wellbeing</h2>
            <p className="text-white/70">
              Each encounter is co-created with our mahouts, naturalists, and wellness guides to honour the herd&apos;s pace. Small groups
              ensure our elephants lead interactions with calm curiosity.
            </p>
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#97f2c4] transition hover:text-white"
            >
              Plan your retreat
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
          <div className="grid gap-6">
            {experiences.map((experience) => (
              <div key={experience.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-[#97f2c4]">{experience.title}</h3>
                <p className="mt-3 text-sm text-white/70">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sanctuary" className="bg-[#0b1f1a] py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Sanctuary life</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">A refuge built around elephant intuition</h2>
            <p className="text-white/70">
              Our herd roams open forest corridors, forages on native flora, and receives personalised enrichment activities. Guests are
              welcomed to observe rather than perform, learning the language of respect these majestic animals deserve.
            </p>
            <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-[#97f2c4]">Holistic Veterinary Care</p>
                <p className="mt-2">
                  On-site veterinarians and herbalists craft wellness plans blending modern science with traditional remedies.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-[#97f2c4]">Mahout Heritage</p>
                <p className="mt-2">
                  Third-generation mahouts guide every interaction, sharing cultural stories and lifelong bonds with the herd.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(151,242,196,0.15),_transparent_65%)] p-8">
              <h3 className="text-2xl font-semibold text-[#97f2c4]">Stay in eco-luxury retreats</h3>
              <p className="mt-4 text-sm text-white/70">
                Every suite is intentionally designed to immerse you in the forest soundscape while reducing environmental footprint.
                Choose the setting that matches your pace.
              </p>
              <div className="mt-8 space-y-5">
                {retreatSuites.map((suite) => (
                  <div key={suite.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h4 className="text-lg font-semibold text-white">{suite.name}</h4>
                    <p className="mt-2 text-sm text-white/70">{suite.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Our promise</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">Conservation-centered hospitality</h2>
            <p className="text-white/70">
              TTE Elephant Sanctuary exists to ensure every elephant lives with agency, community, and care. Your stay is a pledge to
              long-term conservation and regenerative travel practices.
            </p>
            <div className="space-y-5">
              {commitments.map((commitment) => (
                <div key={commitment.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-semibold text-white">{commitment.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{commitment.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-[2.5rem] border border-white/10 bg-[#11392d] p-8 text-sm text-white/80">
              <h3 className="text-lg font-semibold text-[#97f2c4]">Guest reflections</h3>
              <div className="mt-6 space-y-6">
                {testimonials.map((testimonial) => (
                  <blockquote key={testimonial.name} className="space-y-3">
                    <p className="text-base italic text-white/90">“{testimonial.quote}”</p>
                    <footer className="text-xs uppercase tracking-[0.3em] text-[#97f2c4]">{testimonial.name}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f1a] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">From the field journal</span>
              <h2 className="text-3xl font-semibold sm:text-4xl">Stories from our caretakers and conservationists</h2>
              <p className="text-white/70">
                Follow our blog for monthly updates on herd milestones, rescue missions, and mindful travel practices you can carry home.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#97f2c4] transition hover:text-white"
              prefetch={false}
            >
              Read all stories &rarr;
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {latestPosts.map((post) => (
              <article key={post.slug} className="group rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#97f2c4]">{post.category}</p>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[#97f2c4]">{post.title}</h3>
                <p className="mt-3 text-sm text-white/70">{post.excerpt}</p>
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  {post.date} • {post.author}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-[#97f2c4] transition hover:text-white"
                  prefetch={false}
                >
                  Continue reading
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-[2.75rem] border border-white/10 bg-white/5 p-10 backdrop-blur">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Reserve your stay</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">Let our retreat specialists craft your itinerary</h2>
            <p className="text-sm text-white/70">
              Share your preferred dates and interests. Our team will respond within 24 hours to confirm availability, personalise
              experiences, and arrange transport from Kuala Lumpur.
            </p>
          </div>
          <form className="mt-10 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-white/80">
              Full name
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@tteelephant.com"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Phone number
              <input
                type="tel"
                name="phone"
                placeholder="+60"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Preferred stay type
              <select
                name="retreat"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white focus:border-[#97f2c4] focus:outline-none"
                defaultValue="Rainforest Villa"
              >
                {retreatSuites.map((suite) => (
                  <option key={suite.name} value={suite.name} className="bg-[#0b1f1a] text-white">
                    {suite.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Check-in date
              <input
                type="date"
                name="checkIn"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Check-out date
              <input
                type="date"
                name="checkOut"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80 md:col-span-2">
              Tell us about your intentions for this retreat
              <textarea
                name="notes"
                rows={4}
                placeholder="Wellness goals, celebrations, accessibility needs, or elephants you hope to meet"
                className="w-full rounded-2xl border border-white/10 bg-[#06110d] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#97f2c4] focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="md:col-span-2 inline-flex items-center justify-center rounded-full bg-[#97f2c4] px-6 py-3 text-sm font-semibold text-[#0b1f1a] shadow-lg shadow-[#97f2c4]/20 transition hover:bg-[#7edba7]"
            >
              Submit booking request
            </button>
          </form>
        </div>
      </section>

      <section id="contact" className="bg-[#06110d] py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#97f2c4]">Connect with us</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">Plan a bespoke experience for your group</h2>
            <p className="text-white/70">
              Our concierge team is ready to craft corporate retreats, wellness residencies, and conservation education journeys.
              Reach out to co-create a visit that aligns with your intention.
            </p>
            <div className="space-y-4 text-sm text-white/70">
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                <a href="mailto:concierge@tteelephant.com" className="text-[#97f2c4] hover:text-white">
                  concierge@tteelephant.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-white">Phone:</span>{" "}
                <a href="tel:+60312345678" className="text-[#97f2c4] hover:text-white">
                  +60 3-1234 5678
                </a>
              </p>
              <p>
                <span className="font-semibold text-white">Sanctuary Hours:</span> Daily, 7:00 AM – 7:00 PM
              </p>
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 text-sm text-white/70 backdrop-blur">
            <h3 className="text-lg font-semibold text-white">How to get here</h3>
            <p className="mt-3">
              We are 90 minutes from Kuala Lumpur International Airport. Private transfers, chartered vans, and helicopter
              landings can be arranged upon request.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="font-semibold text-white">Coordinates</p>
                <p>3.116° N, 101.816° E</p>
              </div>
              <div>
                <p className="font-semibold text-white">Transport options</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Private chauffeured transfer with sanctuary guide</li>
                  <li>Electric SUV rental with charging available on-site</li>
                  <li>Helicopter landing pad for executive arrivals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
