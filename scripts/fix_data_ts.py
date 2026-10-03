import re

with open('lib/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Event interface
new_fields = """  featured?: boolean;
  isPast: boolean;
  createdAt?: string;
  status?: string;
  allowSpeakers?: boolean;
  allowTrainees?: boolean;"""

c = c.replace(
    """  featured?: boolean;
  isPast: boolean;
  createdAt?: string;""",
    new_fields
)

with open('lib/data.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
