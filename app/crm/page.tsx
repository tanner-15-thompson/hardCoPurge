import { redirect } from "next/navigation"

export default function CRMRedirectPage() {
  redirect("/admin/clients")
}
