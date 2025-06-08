import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a singleton instance for the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  // If we already have an instance, return it
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not available. Using mock data instead.")
    // Return null to indicate Supabase is not available
    return null
  }

  // Create and store the instance
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}
