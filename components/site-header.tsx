import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary-700 text-white">
      <div className="bg-primary-950 py-1 text-center text-xs font-medium">
        A Hub of Innovation & Entrepreneurship Activities
      </div>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded bg-white p-1">
              <div className="h-full w-full bg-primary-700"></div>
            </div>
            <span className="text-lg font-bold">ASBhive</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-6 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary-200">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
          >
            <Link href="/add">Add Organization</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
