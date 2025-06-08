"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getFilterOptions } from "@/lib/data"

export function CollapsibleFilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [openSectors, setOpenSectors] = useState(true)
  const [openLocations, setOpenLocations] = useState(true)
  const [sectors, setSectors] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load filter options from real data
    getFilterOptions().then(({ sectors, locations }) => {
      setSectors(sectors)
      setLocations(locations)
    })
  }, [])

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(type, value)
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("sector")
    params.delete("location")
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const activeSector = searchParams.get("sector")
  const activeLocation = searchParams.get("location")
  const hasActiveFilters = activeSector || activeLocation

  const filterContent = (
    <div className="space-y-4">
      <Collapsible open={openSectors} onOpenChange={setOpenSectors}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0 font-medium text-primary-700">
            Sectors
            <ChevronDown className={`h-4 w-4 transition-transform ${openSectors ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {sectors.slice(0, 15).map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox
                id={`sector-${sector}`}
                checked={activeSector === sector}
                onCheckedChange={() => handleFilterChange("sector", sector)}
                className="border-primary-200 data-[state=checked]:bg-primary-700 data-[state=checked]:text-primary-50"
              />
              <Label htmlFor={`sector-${sector}`} className="text-sm">
                {sector}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openLocations} onOpenChange={setOpenLocations}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0 font-medium text-primary-700">
            Locations
            <ChevronDown className={`h-4 w-4 transition-transform ${openLocations ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {locations.slice(0, 15).map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={activeLocation === location}
                onCheckedChange={() => handleFilterChange("location", location)}
                className="border-primary-200 data-[state=checked]:bg-primary-700 data-[state=checked]:text-primary-50"
              />
              <Label htmlFor={`location-${location}`} className="text-sm">
                {location}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )

  // For desktop: collapsible sidebar
  const desktopFilter = (
    <Card className="sticky top-4 border-primary-100">
      <CardHeader className="border-b border-primary-100 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary-700">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-0 text-xs text-primary-600 hover:text-primary-800"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4">{filterContent}</CardContent>
    </Card>
  )

  // For mobile: slide-in sheet
  const mobileFilter = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && <span className="ml-1 text-xs">({activeSector || activeLocation ? "1" : "0"})</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex justify-between">
            Filters
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto text-xs text-primary-600">
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-1">{filterContent}</div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {mobileFilter}
      <div className="hidden lg:block">{desktopFilter}</div>
    </>
  )
}
