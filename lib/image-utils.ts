import { createClientSupabaseClient } from "@/lib/supabase"

/**
 * Get a public URL for an image stored in Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path to the image within the bucket
 * @returns The public URL for the image
 */
export function getSupabaseImageUrl(bucket: string, path: string): string {
  const supabase = createClientSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Get a Supabase Storage URL with image transformations
 * @param bucket The storage bucket name
 * @param path The path to the image within the bucket
 * @param width Optional width to resize the image to
 * @param height Optional height to resize the image to
 * @param quality Optional quality (1-100) for the image
 * @returns The transformed image URL
 */
export function getSupabaseImageTransformUrl(
  bucket: string,
  path: string,
  width?: number,
  height?: number,
  quality = 80,
): string {
  const supabase = createClientSupabaseClient()

  let transformOptions = {}

  if (width || height) {
    transformOptions = {
      width,
      height,
      quality,
      resize: "cover",
    }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path, {
    transform: transformOptions,
  })

  return data.publicUrl
}
