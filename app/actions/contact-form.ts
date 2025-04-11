"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data as simple strings
    const name = formData.get("name")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const phone = formData.get("phone")?.toString() || "Not provided"
    const goal = formData.get("goal")?.toString() || ""
    const experience = formData.get("experience")?.toString() || ""
    const message = formData.get("message")?.toString() || "No additional information provided"
    const preferredContact = formData.get("preferredContact")?.toString() || "email"

    // Log form submission
    console.log("Form submission received:")
    console.log("Name:", name)
    console.log("Email:", email)

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()

    // Insert form data into Supabase
    const { error } = await supabase.from("contact_submissions").insert([
      {
        name,
        email,
        phone,
        goal,
        experience,
        message,
        preferred_contact: preferredContact,
      },
    ])

    if (error) {
      console.error("Error inserting into Supabase:", error.message)
      return {
        success: false,
        message: "Failed to submit form. Please try again later.",
      }
    }

    console.log("Form submission stored in Supabase successfully")

    // Return success
    return {
      success: true,
      message: "Form submitted successfully! We will contact you soon.",
    }
  } catch (error) {
    // Safely log the error
    console.error("Error in form submission process")

    return {
      success: false,
      message: "Failed to submit form. Please try again later.",
    }
  }
}
