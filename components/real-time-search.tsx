"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

interface RealTimeSearchProps {
  defaultValue?: string
}

export function RealTimeSearch({ defaultValue = "" }: RealTimeSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)
  const debouncedQuery = useDebounce(query, 300)

  const updateUrl = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery) {
        params.set("query", searchQuery)
      } else {
        params.delete("query")
      }

      // Reset to page 1 when searching
      params.delete("page")

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  useEffect(() => {
    updateUrl(debouncedQuery)
  }, [debouncedQuery, updateUrl])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
      <Input
        type="search"
        placeholder="Search by name, sector, location, or any keyword..."
        className="h-12 bg-primary-800/50 pl-10 pr-4 text-white placeholder:text-white/70 border-primary-600 focus-visible:ring-primary-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
