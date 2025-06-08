import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 rounded-full bg-primary-100 p-4 inline-block">
            <Search className="h-8 w-8 text-primary-700" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Organization Not Found</h1>

          <p className="text-gray-600 mb-8">
            The organization you're looking for doesn't exist or may have been removed from our directory.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/add">Add This Organization</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
