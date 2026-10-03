const fs = require('fs');
let c = fs.readFileSync('app/join/page.tsx', 'utf8');
c = c.replace(/href="\/terms"/g, 'href="/code-of-conduct"');
fs.writeFileSync('app/join/page.tsx', c);
