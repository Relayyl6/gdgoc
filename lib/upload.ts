/**
 * Uploads a file to Vercel Blob via our API route.
 * Returns the public URL of the uploaded file.
 */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Image upload failed:', error);
    throw new Error(error.message || 'Upload failed');
  }
}
