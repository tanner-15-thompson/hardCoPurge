import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === "fitness-images")

    if (!bucketExists) {
      // Create the fitness-images bucket
      const { data, error } = await supabase.storage.createBucket("fitness-images", {
        public: true, // Make the bucket public
        fileSizeLimit: 10485760, // 10MB
      })

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Storage bucket created successfully",
        data,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Storage bucket already exists",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to set up storage bucket",
      },
      { status: 500 },
    )
  }
}
