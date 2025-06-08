"use client"

import { useState, useRef } from "react"
import { RefreshCw, Database, Check, X, Clock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UploadCsvForm } from "@/components/upload-csv-form"
import { Toast } from "@/components/ui/toast"
import { mockPendingEntities, mockUpdateLogs } from "@/lib/mock-data"
import { PendingEntityModal } from "@/components/pending-entity-modal"
import { fetchTrendingNews } from "@/app/actions/news"

export default function AdminPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRefreshingNews, setIsRefreshingNews] = useState(false)
  const [pendingEntities, setPendingEntities] = useState(mockPendingEntities)
  const [updateLogs, setUpdateLogs] = useState(mockUpdateLogs)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastNewsRefresh, setLastNewsRefresh] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  const [selectedEntity, setSelectedEntity] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRunUpdate = async () => {
    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Add a new log entry
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: "update",
        details: "68 rows updated",
        duration: "2 mins",
      }
      setUpdateLogs([newLog, ...updateLogs])
      setLastUpdate(new Date())
      setToast({ message: "Update Success", type: "success" })
    } catch (error) {
      console.error("Error running update:", error)
      setToast({ message: "Update Failed", type: "error" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRefreshNews = async () => {
    setIsRefreshingNews(true)

    try {
      const result = await fetchTrendingNews()

      if (result.success) {
        // Add a new log entry
        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          action: "news_refresh",
          details: `${result.newsCount || 0} trending news items fetched from Grok AI`,
          duration: "30 secs",
        }
        setUpdateLogs([newLog, ...updateLogs])
        setLastNewsRefresh(new Date())
        setToast({
          message: `Successfully fetched ${result.newsCount || 0} trending news items`,
          type: "success",
        })
      } else {
        throw new Error(result.error || "Failed to fetch news")
      }
    } catch (error: any) {
      console.error("Error refreshing news:", error)
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: "news_refresh",
        details: `Failed: ${error.message}`,
        duration: "10 secs",
      }
      setUpdateLogs([newLog, ...updateLogs])
      setToast({
        message: `News refresh failed: ${error.message}`,
        type: "error",
      })
    } finally {
      setIsRefreshingNews(false)
    }
  }

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEntity(null)
  }

  const handleApprove = (id: string) => {
    setPendingEntities(pendingEntities.filter((entity) => entity.id !== id))

    // Add a new log entry
    const entityName = pendingEntities.find((e) => e.id === id)?.name || "Unknown"
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: "approve",
      details: `Approved: ${entityName}`,
      duration: "1 sec",
    }
    setUpdateLogs([newLog, ...updateLogs])
  }

  const handleReject = (id: string) => {
    setPendingEntities(pendingEntities.filter((entity) => entity.id !== id))

    // Add a new log entry
    const entityName = pendingEntities.find((e) => e.id === id)?.name || "Unknown"
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: "reject",
      details: `Rejected: ${entityName}`,
      duration: "1 sec",
    }
    setUpdateLogs([newLog, ...updateLogs])
  }

  const scrollToUpload = () => {
    setActiveTab("upload")
    setTimeout(() => {
      if (uploadSectionRef.current) {
        uploadSectionRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage the ASBhive directory data and approve new entries</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Run Data Update</CardTitle>
            <CardDescription>Scrape websites and enrich data with Gemini AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRunUpdate} disabled={isUpdating} className="w-full mb-2">
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Run Update
                </>
              )}
            </Button>
            {lastUpdate && <p className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleString()}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Refresh News Feed</CardTitle>
            <CardDescription>Fetch top 10 trending news with Grok AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefreshNews} disabled={isRefreshingNews} className="w-full mb-2" variant="outline">
              {isRefreshingNews ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Fetching News...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh News
                </>
              )}
            </Button>
            {lastNewsRefresh && (
              <p className="text-xs text-muted-foreground">Last refreshed: {lastNewsRefresh.toLocaleString()}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upload Data</CardTitle>
            <CardDescription>Bulk upload organizations via CSV/Excel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={scrollToUpload} className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending">
            Pending Approvals
            <Badge variant="secondary" className="ml-2">
              {pendingEntities.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="logs">Update Logs</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingEntities.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEntities.map((entity) => (
                      <TableRow key={entity.id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleEntityClick(entity)}
                            className="text-left hover:text-primary-700 hover:underline"
                          >
                            {entity.name}
                          </button>
                        </TableCell>
                        <TableCell>
                          {entity.entity_type === "social_enterprise" && "Social Enterprise"}
                          {entity.entity_type === "investor" && "Investor"}
                          {entity.entity_type === "ecosystem_builder" && "Ecosystem Builder"}
                        </TableCell>
                        <TableCell>{new Date(entity.submitted_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleReject(entity.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleApprove(entity.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 text-lg font-medium">All caught up!</h3>
                <p className="mt-1 text-sm text-muted-foreground">There are no pending approvals at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updateLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        {log.action === "update" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Database className="mr-1 h-3 w-3" />
                            Update
                          </Badge>
                        )}
                        {log.action === "news_refresh" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <RefreshCw className="mr-1 h-3 w-3" />
                            News
                          </Badge>
                        )}
                        {log.action === "approve" && (
                          <Badge variant="outline" className="bg-teal-50 text-teal-700">
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </Badge>
                        )}
                        {log.action === "reject" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{log.duration}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div ref={uploadSectionRef}>
            <Card>
              <CardHeader>
                <CardTitle>Bulk Upload Organizations</CardTitle>
                <CardDescription>Upload multiple organizations to the directory at once</CardDescription>
              </CardHeader>
              <CardContent>
                <UploadCsvForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PendingEntityModal
        entity={selectedEntity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </main>
  )
}
