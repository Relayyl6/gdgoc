const fs = require('fs');
let c = fs.readFileSync('app/events/[id]/page.tsx', 'utf8');

c = c.replace(/<Link\s+href=\{\`\/events\/\$\{event\.id\}\/register\`\}\s+className="block w-full text-center bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-black transition-colors"\s*>\s*Register Now\s*<\/Link>/g, 
  '{event.bevyLink ? (<a href={event.bevyLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-black transition-colors">Register Now</a>) : (<button disabled className="block w-full text-center bg-gray-300 text-gray-500 font-semibold py-4 rounded-xl cursor-not-allowed">Registration Link Unavailable</button>)}'
);

c = c.replace(/<Link\s+href=\{\`\/events\/\$\{event\.id\}\/register\?role=speaker\`\}\s+className="block w-full text-center bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-100 transition-colors mt-3"\s*>\s*Register as a Speaker\s*<\/Link>/g, 
  '{event.allowSpeakers && (<Link href={`/events/${event.id}/register?role=speaker`} className="block w-full text-center bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-100 transition-colors mt-3">Register as a Speaker</Link>)}'
);

c = c.replace(/<Link\s+href=\{\`\/events\/\$\{event\.id\}\/register\?role=trainee\`\}\s+className="block w-full text-center bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-100 transition-colors mt-3"\s*>\s*Register as a Trainee\s*<\/Link>/g, 
  '{event.allowTrainees && (<Link href={`/events/${event.id}/register?role=trainee`} className="block w-full text-center bg-green-50 text-green-700 font-semibold py-3 rounded-xl hover:bg-green-100 transition-colors mt-3">Register as a Trainee</Link>)}'
);

fs.writeFileSync('app/events/[id]/page.tsx', c);
console.log('done');
