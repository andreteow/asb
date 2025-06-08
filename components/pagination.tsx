"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const showingStart = (currentPage - 1) * 10 + 1
  const showingEnd = Math.min(currentPage * 10, total)

  return (
    <div className="flex items-center justify-between border-t border-primary-100 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link href={createPageUrl(currentPage + 1)}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{showingStart}</span> to{" "}
            <span className="font-medium">{showingEnd}</span> of <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {currentPage > 1 ? (
              <Button asChild variant="outline" size="sm" className="rounded-r-none">
                <Link href={createPageUrl(currentPage - 1)}>
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-r-none">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              const isActive = pageNumber === currentPage

              return (
                <Button
                  key={pageNumber}
                  asChild={!isActive}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`rounded-none ${isActive ? "bg-primary-700 hover:bg-primary-800" : ""}`}
                  disabled={isActive}
                >
                  {isActive ? <span>{pageNumber}</span> : <Link href={createPageUrl(pageNumber)}>{pageNumber}</Link>}
                </Button>
              )
            })}

            {currentPage < totalPages ? (
              <Button asChild variant="outline" size="sm" className="rounded-l-none">
                <Link href={createPageUrl(currentPage + 1)}>
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-l-none">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
