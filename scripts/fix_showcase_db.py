import re
with open('app/events/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("getCollection('gdgoc_showcase')", "getCollection('gdgoc_media_gallery')")

with open('app/events/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
print('done')
