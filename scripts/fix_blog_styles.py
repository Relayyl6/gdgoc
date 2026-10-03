import re
import os

# 1. Update tailwind.config.ts
with open('tailwind.config.ts', 'r', encoding='utf-8') as f:
    c = f.read()

if 'require("@tailwindcss/typography")' not in c:
    c = c.replace('plugins: []', 'plugins: [require("@tailwindcss/typography")]')
    with open('tailwind.config.ts', 'w', encoding='utf-8') as f:
        f.write(c)

# 2. Update app/blog/[id]/page.tsx
with open('app/blog/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the giant dangerouslySetInnerHTML className
# from `className="\n          prose-content...` to `className="prose prose-lg prose-blue max-w-none"`
m = re.sub(r'className="\s*prose-content.*?"', 'className="prose prose-lg prose-blue max-w-none prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-a:text-blue-600 hover:prose-a:text-blue-500"', c, flags=re.DOTALL)

with open('app/blog/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(m)

print('done')
