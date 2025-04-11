import { redirect } from "next/navigation"

export default function ClientsPage() {
  // Redirect to the first client for now
  // In a real app, this would show a list of clients or a selection screen
  redirect("/clients/1")
}
