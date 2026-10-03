import re

with open('app/join/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "{ title: 'Complete Local Form', desc: 'Fill out our chapter-specific intake form so we know your academic track.', link: '#', actionText: 'Intake Form (Coming Soon)' }",
    "{ title: 'Explore our Linktree', desc: 'Find all our official channels, resources, and upcoming events in one place.', link: 'https://tr.ee/W662ybKdZx', actionText: 'Explore Linktree' }"
)

c = c.replace(
    "{ title: 'Join the Community', desc: 'Get verified and receive your exclusive invite to our Discord and WhatsApp groups.', link: '#', actionText: 'Join Groups (Post-Registration)' }",
    "{ title: 'Join the Community', desc: 'Connect with hundreds of student developers, share ideas, and grow together.', link: 'https://chat.whatsapp.com/K8tl5aMMjEa7LqJOdxl2zb', actionText: 'Join WhatsApp Group' }"
)

c = c.replace(
    'className="bg-gray-50 p-10 md:p-16 rounded-[3rem] border border-gray-100 relative overflow-hidden"',
    'className="bg-gray-50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 relative overflow-hidden"'
)

c = c.replace(
    'className="space-y-8 relative"',
    'className="space-y-6 relative"'
)

with open('app/join/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
