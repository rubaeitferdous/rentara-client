/**
 * Uploads a file directly to ImgBB and returns the public CDN image URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please check your environment variables.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed. Please try again.");
  }

  return data.data.url as string;
}
