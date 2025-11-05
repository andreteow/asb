import Link from "next/link"
import { Button } from "@/components/ui/button"

const navigation = [
  { href: "#experiences", label: "Experiences" },
  { href: "#sanctuary", label: "Sanctuary" },
  { href: "/blog", label: "Stories" },
  { href: "#contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100/20 bg-[#0b1f1a]/95 text-white backdrop-blur">
      <div className="bg-[#11392d] py-1 text-center text-xs font-medium tracking-wide">
        Mindful escapes with rescued elephants at TTE Elephant Sanctuary
      </div>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f7a5c] font-semibold shadow-lg">
            TTE
          </span>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-[0.3em] text-[#97f2c4]">TTE Elephant</span>
            <span className="text-lg font-semibold leading-none">Sanctuary</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#97f2c4]"
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          className="hidden rounded-full bg-[#97f2c4] px-6 text-sm font-semibold text-[#0b1f1a] shadow-md hover:bg-[#7edba7] md:inline-flex"
        >
          <Link href="#booking">Book a Stay</Link>
        </Button>
      </div>
    </header>
  )
}
