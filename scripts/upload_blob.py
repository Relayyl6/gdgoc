import re

with open('app/events/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_submit = """  // Submit memory for approval
  const handleMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) {
      setUploadError('Please select an image file first.');
      return;
    }

    const persistMemory = async (srcString: string) => {
      // Map to the MediaItem schema expected by /admin/media
      const newMemory = {
        id: `upload-${Date.now()}`,
        eventId: params.id, // we still keep this so we know what event it belongs to
        url: srcString,
        status: 'pending',
        caption: memoryCaption.trim() || undefined,
        author: uploaderName.trim() || 'Attendee',
        uploadedAt: new Date().toISOString(),
      };

      let existingItems: any[] = [];
      try {
        const saved = await getCollection('gdgoc_media_gallery');
        if (saved) {
          existingItems = saved as any[];
        }
      } catch (err) {}

      const updated = [newMemory, ...existingItems];
      await saveCollection('gdgoc_media_gallery', updated);

      // Reset modal form
      setSelectedFile(null);
      setPreviewUrl(null);
      setMemoryCaption('');
      setUploaderName('');
      setUploadError('');
      setIsUploadModalOpen(false);

      // Show success notification
      setSuccessMessage('Your memory has been submitted for approval');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    };

    if (selectedFile) {
      // Also read as base64 for persistent cross-session storage, fallback to createObjectURL
      const reader = new FileReader();
      reader.onload = () => {
        persistMemory((reader.result as string) || URL.createObjectURL(selectedFile));
      };
      reader.onerror = () => {
        persistMemory(URL.createObjectURL(selectedFile));
      };
      reader.readAsDataURL(selectedFile);
    } else if (previewUrl) {
      persistMemory(previewUrl);
    }
  };"""

new_submit = """  // Submit memory for approval
  const [isUploading, setIsUploading] = useState(false);

  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'gdgoc_showcase');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const imageUrl = data.url;

      // Map to the MediaItem schema expected by /admin/media
      const newMemory = {
        id: `upload-${Date.now()}`,
        eventId: params.id,
        url: imageUrl,
        status: 'pending',
        caption: memoryCaption.trim() || undefined,
        author: uploaderName.trim() || 'Attendee',
        uploadedAt: new Date().toISOString(),
      };

      let existingItems: any[] = [];
      try {
        const saved = await getCollection('gdgoc_media_gallery');
        if (saved) {
          existingItems = saved as any[];
        }
      } catch (err) {}

      const updated = [newMemory, ...existingItems];
      await saveCollection('gdgoc_media_gallery', updated);

      // Reset modal form
      setSelectedFile(null);
      setPreviewUrl(null);
      setMemoryCaption('');
      setUploaderName('');
      setIsUploadModalOpen(false);

      // Show success notification
      setSuccessMessage('Your memory has been submitted for approval');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };"""

c = c.replace(old_submit, new_submit)

# Also update the submit button to show loading state
c = c.replace(
    """<button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow"
                >
                  <Upload className="w-4 h-4" /> Submit Memory
                </button>""",
    """<button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Submit Memory'}
                </button>"""
)

with open('app/events/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
