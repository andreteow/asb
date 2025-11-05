import Link from "next/link"

const quickLinks = [
  { href: "#experiences", label: "Guest Experiences" },
  { href: "#sanctuary", label: "Meet Our Elephants" },
  { href: "/blog", label: "Sanctuary Stories" },
  { href: "#booking", label: "Book Your Stay" },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0b1f1a] py-12 text-white">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-[#97f2c4]">TTE Elephant Sanctuary</h3>
          <p className="mt-3 text-sm text-white/70">
            We create gentle encounters between people and elephants through slow travel, mindful retreats, and
            conservation-first hospitality in the heart of nature.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#97f2c4]">Visit Us</h3>
          <address className="mt-3 space-y-1 text-sm not-italic text-white/70">
            <p>Lot 8, Sanctuary Road</p>
            <p>Ulu Langat Rainforest, Selangor</p>
            <p>Malaysia</p>
            <p className="pt-2">
              <a href="tel:+601112223333" className="hover:text-[#97f2c4]">+60 11-1222 3333</a>
            </p>
            <p>
              <a href="mailto:hello@tteelephant.com" className="hover:text-[#97f2c4]">hello@tteelephant.com</a>
            </p>
          </address>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#97f2c4]">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[#97f2c4]" prefetch={false}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
        <p>&copy; {new Date().getFullYear()} TTE Elephant Sanctuary. All rights reserved.</p>
      </div>
    </footer>
  )
}
