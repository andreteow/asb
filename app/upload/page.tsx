"use client"

import { useState } from "react"
import { useRouter, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileSpreadsheet, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCsvForm } from "@/components/upload-csv-form"

export default function UploadPage() {
  redirect("/admin")

  const router = useRouter()
  const [isUploaded, setIsUploaded] = useState(false)

  const handleUploadSuccess = () => {
    setIsUploaded(true)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to directory
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bulk Upload</h1>
          <p className="mt-2 text-muted-foreground">Upload multiple organizations to the directory at once</p>
        </div>

        {!isUploaded ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV or Excel File</CardTitle>
              <CardDescription>
                Upload a spreadsheet with organization data to add multiple entries at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadCsvForm onSuccess={handleUploadSuccess} />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>Your file should include columns for: name, website, entity_type, description, etc.</p>
                  <p className="mt-1">
                    Don't have a template?{" "}
                    <Link href="#" className="text-teal-600 hover:underline">
                      Download sample CSV
                    </Link>
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="rounded-full bg-teal-100 p-3">
                <Check className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium">🎉 Data imported successfully!</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Your ecosystem just got richer. The data has been added to the directory.
              </p>
              <div className="mt-6 flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/upload">Upload Another File</Link>
                </Button>
                <Button asChild>
                  <Link href="/">View Directory</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
