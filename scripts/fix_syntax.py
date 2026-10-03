import re

with open('app/admin/events/create/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the syntax error
c = c.replace(
    'const [allowSpeakers,\n      allowTrainees,\n      status: publishNow ? "published" : "draft",\n      isOnline, setIsOnline] = useState(false);',
    'const [isOnline, setIsOnline] = useState(false);'
)

# Insert the fields into the correct newEvent payload
c = c.replace(
    'bevyLink: form.bevyLink || undefined,\n      isOnline,',
    'bevyLink: form.bevyLink || undefined,\n      allowSpeakers,\n      allowTrainees,\n      status: publishNow ? "published" : "draft",\n      isOnline,'
)

with open('app/admin/events/create/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
