import { ImageUploader } from "@/components/admin/image-uploader"
import { createServerSupabaseClient } from "@/lib/supabase"
import Image from "next/image"

export default async function ImagesPage() {
  const supabase = createServerSupabaseClient()

  // Get the list of buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

  // Get images from the fitness-images bucket if it exists
  let images: any[] = []
  let bucketError = null

  if (buckets && buckets.some((b) => b.name === "fitness-images")) {
    const { data, error } = await supabase.storage.from("fitness-images").list()
    if (data) {
      images = data.filter((item) => !item.id.endsWith("/"))
    }
    bucketError = error
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Image Management</h1>

      <ImageUploader />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Storage Buckets</h2>

        {bucketsError ? (
          <p className="text-red-400">Error loading buckets: {bucketsError.message}</p>
        ) : buckets && buckets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buckets.map((bucket) => (
              <div key={bucket.id} className="p-4 border border-purple-900/50 rounded-lg">
                <h3 className="font-bold">{bucket.name}</h3>
                <p className="text-sm text-gray-400">Created: {new Date(bucket.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No buckets found. Create one in the Supabase dashboard.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Images in fitness-images Bucket</h2>

        {bucketError ? (
          <p className="text-red-400">Error loading images: {bucketError.message}</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => {
              const imageUrl = supabase.storage.from("fitness-images").getPublicUrl(image.name).data.publicUrl

              return (
                <div key={image.id} className="space-y-2">
                  <div className="relative aspect-square border border-purple-900/50 rounded-lg overflow-hidden">
                    <Image src={imageUrl || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                  </div>
                  <p className="text-sm truncate">{image.name}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p>No images found in the fitness-images bucket.</p>
        )}
      </div>
    </div>
  )
}
