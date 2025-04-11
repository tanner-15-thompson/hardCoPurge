import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Utensils } from "lucide-react"

export default function ManageQuestionnairesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Questionnaires</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Workout Questionnaire
            </CardTitle>
            <CardDescription>Manage workout assessment questions for clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Edit questions related to fitness goals, exercise history, and physical limitations.
            </p>
            <Link href="/admin/questionnaires/workout">
              <Button className="w-full">Manage Workout Questionnaire</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Nutrition Questionnaire
            </CardTitle>
            <CardDescription>Manage nutrition assessment questions for clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Edit questions related to dietary preferences, restrictions, and nutritional goals.
            </p>
            <Link href="/admin/questionnaires/nutrition">
              <Button className="w-full">Manage Nutrition Questionnaire</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
