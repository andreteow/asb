"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddEntityForm } from "@/components/add-entity-form"
import { UploadCsvForm } from "@/components/upload-csv-form"
import { getEntityById } from "@/lib/data"
import { Toast } from "@/components/ui/toast"

export default function AddPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")

  const [activeTab, setActiveTab] = useState<string>("website")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEntity, setIsLoadingEntity] = useState(!!editId)
  const [entityData, setEntityData] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Fetch entity data if editing
  useEffect(() => {
    if (editId) {
      const fetchEntity = async () => {
        setIsLoadingEntity(true)
        try {
          const entity = await getEntityById(editId)
          if (entity) {
            setEntityData(entity)
            setStep(2)
          } else {
            setToast({ message: "Entity not found", type: "error" })
          }
        } catch (error) {
          console.error("Error fetching entity:", error)
          setToast({ message: "Error loading entity data", type: "error" })
        } finally {
          setIsLoadingEntity(false)
        }
      }

      fetchEntity()
    }
  }, [editId])

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!websiteUrl) return

    setIsLoading(true)

    try {
      // In a real implementation, this would call the Gemini enrichment API
      // For now, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setEntityData({
        name: "Example Organization",
        entity_type: "social_enterprise",
        website: websiteUrl,
        description:
          "This is an automatically generated description of the organization based on the website content. Gemini has analyzed the website and extracted key information.",
        hq_location: "Kuala Lumpur, Malaysia",
        industry_sector: "Education, Technology",
        contact_email: "contact@example.org",
        funding_stage: "Seed",
      })

      setStep(2)
    } catch (error) {
      console.error("Error enriching data:", error)
      setToast({ message: "Error analyzing website", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Remove the custom handleFormSubmit since we want to use the real server action
  // The AddEntityForm will handle submission directly

  if (isLoadingEntity) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-700" />
          <p className="mt-4">Loading organization data...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">{editId ? "Edit Profile" : "Add or Claim Your Profile"}</h1>
          <p className="mt-2 text-muted-foreground">
            {editId
              ? "Update your organization's information in the directory"
              : "Join Malaysia's impact ecosystem directory"}
          </p>
        </div>

        {step === 1 && !editId && (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="website">Website URL</TabsTrigger>
              <TabsTrigger value="csv">Upload CSV</TabsTrigger>
            </TabsList>

            <TabsContent value="website">
              <Card>
                <CardHeader>
                  <CardTitle>Add via Website</CardTitle>
                  <CardDescription>
                    Paste your organization's website URL and we'll automatically extract information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWebsiteSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://your-organization.com"
                        className="pl-10"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Generate Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  We use AI to analyze your website and extract relevant information
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="csv">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Upload</CardTitle>
                  <CardDescription>Upload a CSV or Excel file with multiple organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadCsvForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {(step === 2 || editId) && (
          <Card>
            <CardHeader>
              <CardTitle>Review and Submit</CardTitle>
              <CardDescription>
                {editId
                  ? "Edit your organization's information"
                  : "We've pre-filled this form based on your website. Please review and edit as needed."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddEntityForm initialData={entityData} isEditing={!!editId} />
            </CardContent>
          </Card>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </main>
  )
}
