import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Utensils } from "lucide-react"

export default function ManageQuestionnairesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-white">Manage Questionnaires</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Dumbbell className="h-5 w-5 text-purple-400" />
              Workout Questionnaire
            </CardTitle>
            <CardDescription className="text-gray-400">Manage workout assessment questions for clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-300">
              Edit questions related to fitness goals, exercise history, and physical limitations.
            </p>
            <Link href="/admin/questionnaires/workout">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage Workout Questionnaire</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Utensils className="h-5 w-5 text-purple-400" />
              Nutrition Questionnaire
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage nutrition assessment questions for clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-300">
              Edit questions related to dietary preferences, restrictions, and nutritional goals.
            </p>
            <Link href="/admin/questionnaires/nutrition">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage Nutrition Questionnaire</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
