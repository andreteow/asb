"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Check, AlertCircle, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bulkUploadEntities } from "@/lib/data"

interface UploadCsvFormProps {
  onSuccess?: () => void
}

interface CsvRow {
  [key: string]: string
}

interface ColumnMapping {
  [csvColumn: string]: string
}

const ENTITY_COLUMNS = [
  { key: "name", label: "Name *", required: true },
  { key: "entity_type", label: "Entity Type *", required: true },
  { key: "website", label: "Website *", required: true },
  { key: "description", label: "Description *", required: true },
  { key: "hq_location", label: "Headquarters Location", required: false },
  { key: "contact_email", label: "Contact Email", required: false },
  { key: "industry_sector", label: "Industry/Sector", required: false },
  { key: "social_status", label: "Social Status", required: false },
  { key: "funding_stage", label: "Funding Stage", required: false },
  { key: "cheque_size_range", label: "Cheque Size Range", required: false },
  { key: "investment_thesis", label: "Investment Thesis", required: false },
  { key: "program_type", label: "Program Type", required: false },
  { key: "next_intake_date", label: "Next Intake Date", required: false },
  { key: "impact", label: "Impact", required: false },
  { key: "problem_solved", label: "Problem Solved", required: false },
  { key: "target_beneficiaries", label: "Target Beneficiaries", required: false },
  { key: "revenue_model", label: "Revenue Model", required: false },
  { key: "year_founded", label: "Year Founded", required: false },
  { key: "awards", label: "Awards", required: false },
  { key: "grants", label: "Grants", required: false },
  { key: "institutional_support", label: "Institutional Support", required: false },
]

export function UploadCsvForm({ onSuccess }: UploadCsvFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CsvRow[] | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "complete">("upload")
  const [uploadResults, setUploadResults] = useState<{ success: number; errors: string[] } | null>(null)

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
    // Check if file is CSV
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setFile(file)
    setError(null)

    // Parse CSV file
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string

        // Split by lines and filter out empty lines
        const lines = text.split(/\r?\n/).filter((line) => line.trim())

        if (lines.length < 2) {
          setError("CSV file must have at least a header row and one data row")
          return
        }

        // Parse headers - handle quoted fields properly
        const headerLine = lines[0]
        const headers = parseCSVLine(headerLine)
        setCsvHeaders(headers)

        // Parse data rows
        const data: CsvRow[] = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue // Skip empty lines

          const values = parseCSVLine(line)
          const row: CsvRow = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ""
          })
          data.push(row)
        }

        console.log("Parsed CSV data:", { headers, dataCount: data.length, sampleRow: data[0] })
        setCsvData(data)
        setStep("mapping")

        // Auto-map columns based on common names
        const autoMapping: ColumnMapping = {}
        headers.forEach((header) => {
          const lowerHeader = header.toLowerCase().trim()
          if (lowerHeader === "name" || lowerHeader.includes("organization")) {
            autoMapping[header] = "name"
          } else if (lowerHeader === "entity type" || lowerHeader.includes("type")) {
            autoMapping[header] = "entity_type"
          } else if (lowerHeader === "website" || lowerHeader.includes("url")) {
            autoMapping[header] = "website"
          } else if (lowerHeader === "description" || lowerHeader.includes("about")) {
            autoMapping[header] = "description"
          } else if (
            lowerHeader === "headquarters location" ||
            lowerHeader.includes("location") ||
            lowerHeader.includes("address")
          ) {
            autoMapping[header] = "hq_location"
          } else if (lowerHeader === "contact email" || lowerHeader.includes("email")) {
            autoMapping[header] = "contact_email"
          } else if (
            lowerHeader === "industry/sector" ||
            lowerHeader.includes("sector") ||
            lowerHeader.includes("industry")
          ) {
            autoMapping[header] = "industry_sector"
          } else if (lowerHeader === "social status" || lowerHeader.includes("status")) {
            autoMapping[header] = "social_status"
          } else if (
            lowerHeader === "funding stage" ||
            lowerHeader.includes("funding") ||
            lowerHeader.includes("stage")
          ) {
            autoMapping[header] = "funding_stage"
          } else if (lowerHeader === "cheque size range" || lowerHeader.includes("cheque")) {
            autoMapping[header] = "cheque_size_range"
          } else if (lowerHeader === "investment thesis" || lowerHeader.includes("thesis")) {
            autoMapping[header] = "investment_thesis"
          } else if (lowerHeader === "program type" || lowerHeader.includes("program")) {
            autoMapping[header] = "program_type"
          } else if (lowerHeader === "next intake date" || lowerHeader.includes("intake")) {
            autoMapping[header] = "next_intake_date"
          } else if (lowerHeader === "impact") {
            autoMapping[header] = "impact"
          } else if (lowerHeader === "problem solved" || lowerHeader.includes("problem")) {
            autoMapping[header] = "problem_solved"
          } else if (lowerHeader === "target beneficiaries" || lowerHeader.includes("beneficiar")) {
            autoMapping[header] = "target_beneficiaries"
          } else if (lowerHeader === "revenue model" || lowerHeader.includes("revenue")) {
            autoMapping[header] = "revenue_model"
          } else if (
            lowerHeader === "year founded" ||
            lowerHeader.includes("year") ||
            lowerHeader.includes("founded")
          ) {
            autoMapping[header] = "year_founded"
          } else if (lowerHeader === "awards") {
            autoMapping[header] = "awards"
          } else if (lowerHeader === "grants") {
            autoMapping[header] = "grants"
          } else if (lowerHeader === "institutional support" || lowerHeader.includes("institutional")) {
            autoMapping[header] = "institutional_support"
          }
        })

        console.log("Auto-mapped columns:", autoMapping)
        setColumnMapping(autoMapping)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        setError("Error parsing CSV file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  // Helper function to properly parse CSV lines with quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i += 2
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
          i++
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(current.trim())
        current = ""
        i++
      } else {
        current += char
        i++
      }
    }

    // Add the last field
    result.push(current.trim())
    return result
  }

  const handleMappingChange = (csvColumn: string, entityColumn: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [csvColumn]: entityColumn,
    }))
  }

  const validateMapping = () => {
    const requiredColumns = ENTITY_COLUMNS.filter((col) => col.required).map((col) => col.key)
    const mappedColumns = Object.values(columnMapping)

    const missingRequired = requiredColumns.filter((req) => !mappedColumns.includes(req))

    if (missingRequired.length > 0) {
      setError(`Missing required columns: ${missingRequired.join(", ")}`)
      return false
    }

    setError(null)
    return true
  }

  const handlePreview = () => {
    if (validateMapping()) {
      setStep("preview")
    }
  }

  const transformData = () => {
    if (!csvData) return []

    return csvData.map((row, index) => {
      const transformedRow: any = {}

      Object.entries(columnMapping).forEach(([csvColumn, entityColumn]) => {
        if (entityColumn === "skip") return

        let value = (row[csvColumn] || "").toString().trim()

        // Transform entity_type values
        if (entityColumn === "entity_type") {
          const lowerValue = value.toLowerCase()
          if (lowerValue.includes("social") || lowerValue === "social_enterprise") {
            value = "social_enterprise"
          } else if (lowerValue.includes("investor") || lowerValue.includes("fund")) {
            value = "investor"
          } else if (
            lowerValue.includes("ecosystem") ||
            lowerValue.includes("builder") ||
            lowerValue.includes("accelerator") ||
            lowerValue.includes("incubator")
          ) {
            value = "ecosystem_builder"
          }
        }

        // Ensure website has protocol
        if (entityColumn === "website" && value && !value.startsWith("http")) {
          value = `https://${value}`
        }

        // Handle empty values for non-required fields
        if (!value || value === "-" || value.toLowerCase() === "null") {
          if (["name", "entity_type", "website", "description"].includes(entityColumn)) {
            // Required field is empty
            console.error(`Row ${index + 1}: Missing required field ${entityColumn}`)
          }
          value =
            entityColumn === "name" ||
            entityColumn === "entity_type" ||
            entityColumn === "website" ||
            entityColumn === "description"
              ? value
              : ""
        }

        transformedRow[entityColumn] = value
      })

      console.log(`Transformed row ${index + 1}:`, transformedRow)
      return transformedRow
    })
  }

  const handleUpload = async () => {
    if (!csvData) return

    setIsUploading(true)
    setError(null)

    try {
      const transformedData = transformData()
      const result = await bulkUploadEntities(transformedData)

      setUploadResults(result)
      setStep("complete")

      if (onSuccess && result.success > 0) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error uploading data:", error)
      setError(error.message || "Failed to upload data. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setCsvData(null)
    setCsvHeaders([])
    setColumnMapping({})
    setError(null)
    setStep("upload")
    setUploadResults(null)
  }

  const downloadTemplate = () => {
    const headers = ENTITY_COLUMNS.map((col) => col.label.replace(" *", ""))
    const csvContent =
      headers.join(",") +
      "\n" +
      "Example Organization,social_enterprise,https://example.com,Description of the organization,Kuala Lumpur,contact@example.com,Education,Active,Seed,,,,,Making positive impact,Solving education gaps,Students,Service fees,2020,,,"

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "entities_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (step === "upload") {
    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={downloadTemplate} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>

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
          <h3 className="mb-2 text-lg font-medium">Drag and drop your CSV file</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Upload a CSV file with your organization data
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Browse Files
            </Button>
          </div>
          <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    )
  }

  if (step === "mapping") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Map CSV Columns</h3>
            <p className="text-sm text-muted-foreground">
              Map your CSV columns to the database fields. Required fields are marked with *
            </p>
          </div>
          <Button variant="outline" onClick={resetForm}>
            <X className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Column Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {csvHeaders.map((header) => (
              <div key={header} className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <Label className="font-medium">{header}</Label>
                  <p className="text-xs text-muted-foreground">Sample: {csvData?.[0]?.[header] || "N/A"}</p>
                </div>
                <Select
                  value={columnMapping[header] || "skip"}
                  onValueChange={(value) => handleMappingChange(header, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select database field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">-- Skip this column --</SelectItem>
                    {ENTITY_COLUMNS.map((col) => (
                      <SelectItem key={col.key} value={col.key}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={handlePreview}>Preview Data</Button>
        </div>
      </div>
    )
  }

  if (step === "preview") {
    const transformedData = transformData()

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Preview Data</h3>
            <p className="text-sm text-muted-foreground">Review the data before uploading. Showing first 5 rows.</p>
          </div>
          <Button variant="outline" onClick={() => setStep("mapping")}>
            Back to Mapping
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedData.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    {row.entity_type === "social_enterprise" && "Social Enterprise"}
                    {row.entity_type === "investor" && "Investor"}
                    {row.entity_type === "ecosystem_builder" && "Ecosystem Builder"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.website}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{row.description}</TableCell>
                  <TableCell>{row.hq_location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setStep("mapping")}>
            Back
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Upload {transformedData.length} Records
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-green-100 p-3 w-fit">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">Upload Complete!</h3>
          <p className="text-sm text-muted-foreground">
            {uploadResults?.success} records uploaded successfully
            {uploadResults?.errors && uploadResults.errors.length > 0 && `, ${uploadResults.errors.length} errors`}
          </p>
        </div>

        {uploadResults?.errors && uploadResults.errors.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Some records had errors</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc list-inside text-sm">
                {uploadResults.errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {uploadResults.errors.length > 5 && <li>... and {uploadResults.errors.length - 5} more errors</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={resetForm}>
            Upload Another File
          </Button>
          <Button onClick={() => (window.location.href = "/")}>View Directory</Button>
        </div>
      </div>
    )
  }

  return null
}
