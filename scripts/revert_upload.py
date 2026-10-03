import re

with open('app/events/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Make sure we import uploadImage
if 'import { uploadImage }' not in c:
    c = c.replace("import { getCollection, saveCollection } from '@/lib/db';", "import { getCollection, saveCollection } from '@/lib/db';\nimport { uploadImage } from '@/lib/upload';")

old_submit = """  const handleMemorySubmit = async (e: React.FormEvent) => {
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

      const imageUrl = data.url;"""

new_submit = """  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const imageUrl = await uploadImage(selectedFile, 'gdgoc_showcase');"""

c = c.replace(old_submit, new_submit)

with open('app/events/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
