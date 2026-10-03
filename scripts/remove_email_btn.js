const fs = require('fs');
const p = 'app/admin/events/[id]/registrations/page.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/<Link href=\{\`\/admin\/events\/\$\{params\.id\}\/email\`\}[\s\S]*?<\/Link>/, '');
fs.writeFileSync(p, c);
