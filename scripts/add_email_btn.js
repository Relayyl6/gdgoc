const fs = require('fs');
const path = 'app/admin/events/[id]/registrations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<div className="flex items-center gap-3">`;
const replacement = `<div className="flex items-center gap-3">
              <Link href={\`/admin/events/\${params.id}/email\`} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition">Mass Email</Link>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  
  // also add Link import if not present
  if (!content.includes(`import Link from 'next/link';`)) {
    content = `import Link from 'next/link';\n` + content;
  }
  
  fs.writeFileSync(path, content, 'utf8');
  console.log('Added Mass Email button');
} else {
  console.log('Target not found');
}
