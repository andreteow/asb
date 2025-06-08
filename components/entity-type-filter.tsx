"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EntityTypeFilterProps {
  activeType: string
}

export function EntityTypeFilter({ activeType = "all" }: EntityTypeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handleTypeChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("type", value)}`)
  }

  return (
    <Tabs value={activeType} onValueChange={handleTypeChange} className="w-full">
      <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-primary-50">
        <TabsTrigger value="all" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white">
          All
        </TabsTrigger>
        <TabsTrigger
          value="social_enterprise"
          className="data-[state=active]:bg-primary-700 data-[state=active]:text-white"
        >
          Social Enterprises
        </TabsTrigger>
        <TabsTrigger value="investor" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white">
          Investors
        </TabsTrigger>
        <TabsTrigger
          value="ecosystem_builder"
          className="data-[state=active]:bg-primary-700 data-[state=active]:text-white"
        >
          Ecosystem Builders
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
