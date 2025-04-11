export interface Activity {
  id: number
  client_id: number
  activity_type: string
  title: string
  description: string
  metadata: Record<string, any>
  created_at: string
}
