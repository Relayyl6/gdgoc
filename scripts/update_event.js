const fs = require('fs');
let c = fs.readFileSync('app/admin/events/create/page.tsx', 'utf8');

c = c.replace(
  'const [allowSpeakers, setAllowSpeakers] = useState(false);',
  'const [allowSpeakers, setAllowSpeakers] = useState(false);\n  const [allowTrainees, setAllowTrainees] = useState(false);'
);

c = c.replace(
  'function handleSubmit(e: React.FormEvent) {\n    e.preventDefault();',
  'function handleSubmit(e: React.FormEvent) {\n    e.preventDefault();\n    if (!form.bevyLink) {\n      alert("Event Registration Link (Bevy) is required");\n      return;\n    }'
);

c = c.replace(
  'isOnline,',
  'allowSpeakers,\n      allowTrainees,\n      status: publishNow ? "published" : "draft",\n      isOnline,'
);

const toggle_speakers = `<Toggle
                    label="Allow Speakers to Apply"
                    description="Enables a Speaker registration tab on the event page"
                    value={allowSpeakers}
                    onChange={setAllowSpeakers}
                  />`;
const toggle_trainees = `<Toggle
                    label="Allow Trainees to Apply"
                    description="Enables a Trainee registration tab on the event page"
                    value={allowTrainees}
                    onChange={setAllowTrainees}
                  />`;
                  
c = c.replace(toggle_speakers, toggle_speakers + '\n                  ' + toggle_trainees);

c = c.replace('placeholder="https://gdg.community.dev/events/..." />', 'placeholder="https://gdg.community.dev/events/..." required />');

fs.writeFileSync('app/admin/events/create/page.tsx', c, 'utf8');
console.log('done');
