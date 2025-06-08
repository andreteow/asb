"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("query", query)
    } else {
      params.delete("query")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
      <Input
        type="search"
        placeholder="Search by name, sector, or location..."
        className="h-12 bg-primary-800/50 pl-10 pr-24 text-white placeholder:text-white/70 border-primary-600 focus-visible:ring-primary-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" size="sm" className="absolute right-1 top-1 bg-white text-primary-700 hover:bg-primary-100">
        Search
      </Button>
    </form>
  )
}
