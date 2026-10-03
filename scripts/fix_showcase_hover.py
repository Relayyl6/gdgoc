import re

with open('app/showcase/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the gradient overlay
old_gradient = 'className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"'
new_gradient = 'className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"'
c = c.replace(old_gradient, new_gradient)

# Replace the text container
old_text = 'className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"'
new_text = 'className="absolute inset-x-0 bottom-0 p-6 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300"'
c = c.replace(old_text, new_text)

with open('app/showcase/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
