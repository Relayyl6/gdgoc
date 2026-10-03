const fs = require('fs');
const path = 'app/events/[id]/register/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Types
content = content.replace(/type Tab = 'attendee' \| 'speaker' \| 'trainee';/, "type Tab = 'speaker' | 'trainee';");

// 2. Initial Tab
content = content.replace(/const initialTab: Tab =\s*roleParam === 'speaker' \? 'speaker' : roleParam === 'trainee' \? 'trainee' : 'attendee';/g, "const initialTab: Tab = roleParam === 'trainee' ? 'trainee' : 'speaker';");

// 3. Remove attendee from tabs array
content = content.replace(/\{\s*key:\s*'attendee'[^}]+\},?\s*/g, '');

// 4. Remove Attendee Form Component render
content = content.replace(/\{\s*activeTab\s*===\s*'attendee'\s*&&\s*\([\s\S]*?<AttendeeFormComponent\s*onSuccess=\{handleSuccess\}\s*\/>\s*\)\s*\}/g, '');

// 5. Remove attendee from Success messages
content = content.replace(/attendee:\s*\{\s*heading:\s*[^,]+,\s*sub:\s*[^}]+\},?\s*/g, '');

// 6. Optionally, just comment out AttendeeFormComponent logic to avoid unused warnings
content = content.replace(/interface AttendeeForm \{[\s\S]*?\}/g, '');
content = content.replace(/function AttendeeFormComponent\([\s\S]*?(?=\/\/\s*───\s*Speaker Form)/, '');

// 7. Remove unused User icon import
content = content.replace(/User,\s*/, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned up register page');
