import re

with open('app/admin/events/create/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Make Bevy Link optional again in handleSubmit
check_block = """  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bevyLink) {
      alert("Event Registration Link (Bevy) is required");
      return;
    }"""
new_block = """  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();"""

c = c.replace(check_block, new_block)

# Remove 'required' attribute from Bevy Link input
c = c.replace(
    'placeholder="https://gdg.community.dev/events/..." required />',
    'placeholder="https://gdg.community.dev/events/..." />'
)

with open('app/admin/events/create/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
