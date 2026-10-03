const fs = require('fs');
const p = 'app/admin/events/create/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/bevyLink:\s*'',/, 'bevyLink: \'\', speakerLink: \'\', traineeLink: \'\',');

const fields = `
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker WhatsApp/Community Link</label>
            <input type="url" value={form.speakerLink} onChange={e => setForm({...form, speakerLink: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://chat.whatsapp.com/..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trainee WhatsApp/Community Link</label>
            <input type="url" value={form.traineeLink} onChange={e => setForm({...form, traineeLink: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://chat.whatsapp.com/..." />
          </div>
`;

c = c.replace(/(<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Bevy Registration Link<\/label>[\s\S]*?<\/div>)/, '$1\n' + fields);

fs.writeFileSync(p, c);
