export const mockPendingEntities = [
  {
    id: "pending-1",
    name: "GreenTech Solutions",
    entity_type: "social_enterprise",
    website: "https://example.com/greentech",
    description: "Developing affordable solar solutions for rural communities",
    hq_location: "Sarawak",
    industry_sector: "Clean Energy, Technology",
    submitted_at: "2023-08-01T10:30:00Z",
  },
  {
    id: "pending-2",
    name: "Microfinance Access",
    entity_type: "ecosystem_builder",
    website: "https://example.com/microfinance",
    description: "Supporting financial inclusion through microloans and education",
    hq_location: "Kuala Lumpur",
    industry_sector: "Financial Inclusion",
    submitted_at: "2023-08-02T14:15:00Z",
  },
]

export const mockUpdateLogs = [
  {
    id: "log-1",
    timestamp: "2023-08-01T09:30:00Z",
    action: "update",
    details: "42 rows updated",
    duration: "3 mins",
  },
  {
    id: "log-2",
    timestamp: "2023-08-01T09:25:00Z",
    action: "approve",
    details: "Approved: Sustainable Fisheries",
    duration: "1 sec",
  },
  {
    id: "log-3",
    timestamp: "2023-07-30T14:20:00Z",
    action: "news_refresh",
    details: "35 news items fetched",
    duration: "2 mins",
  },
  {
    id: "log-4",
    timestamp: "2023-07-28T11:15:00Z",
    action: "update",
    details: "56 rows updated",
    duration: "4 mins",
  },
  {
    id: "log-5",
    timestamp: "2023-07-25T16:40:00Z",
    action: "reject",
    details: "Rejected: Invalid entry",
    duration: "1 sec",
  },
]
