"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileSpreadsheet, X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UploadCsvFormProps {
  onSuccess?: () => void
}

export function UploadCsvForm({ onSuccess }: UploadCsvFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is CSV or Excel
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      setError("Please upload a CSV or Excel file")
      return
    }

    setFile(file)
    setError(null)

    // Mock parsing the file
    setTimeout(() => {
      // In a real implementation, you would parse the CSV/Excel file
      // For now, we'll create mock data
      setPreviewData([
        {
          name: "EcoCycle Berhad",
          entity_type: "social_enterprise",
          website: "https://ecocycle.my",
          description: "Recycling and waste management social enterprise",
          hq_location: "Kuala Lumpur",
          industry_sector: "Waste Management, Environment",
        },
        {
          name: "Impact Ventures Malaysia",
          entity_type: "investor",
          website: "https://impactventures.my",
          description: "Early-stage impact investor",
          hq_location: "Selangor",
          industry_sector: "Financial Inclusion",
        },
        {
          name: "Social Innovation Hub",
          entity_type: "ecosystem_builder",
          website: "https://sihub.my",
          description: "Accelerator for social enterprises",
          hq_location: "Penang",
          industry_sector: "Education, Technology",
        },
      ])
    }, 1000)
  }

  const handleUpload = async () => {
    if (!previewData) return

    setIsUploading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error uploading data:", error)
      setError("Failed to upload data. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreviewData(null)
    setError(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!file && (
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Drag and drop your file</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Upload a CSV or Excel file with your organization data
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Browse Files
            </Button>
          </div>
          <input id="file-upload" type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {file && !previewData && (
        <div className="flex items-center justify-center p-8">
          <FileSpreadsheet className="mr-2 h-5 w-5 animate-pulse text-primary" />
          <span>Processing file...</span>
        </div>
      )}

      {previewData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <span className="font-medium">{file?.name}</span>
              <span className="text-sm text-muted-foreground">({previewData.length} records)</span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 3).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      {row.entity_type === "social_enterprise" && "Social Enterprise"}
                      {row.entity_type === "investor" && "Investor"}
                      {row.entity_type === "ecosystem_builder" && "Ecosystem Builder"}
                    </TableCell>
                    <TableCell>{row.website}</TableCell>
                    <TableCell>{row.hq_location}</TableCell>
                    <TableCell>{row.industry_sector}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Import Data
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
