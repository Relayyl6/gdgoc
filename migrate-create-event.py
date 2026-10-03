import re

with open('app/events/create/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add AdminLayout import
code = code.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport AdminLayout from '@/components/AdminLayout';"
)

# Replace inputCls
code = code.replace(
    "const inputCls =\n  'w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all';",
    "const inputCls =\n  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';"
)

# Replace labelCls
code = code.replace(
    "const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide';",
    "const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide';"
)

# SectionCard styling
code = code.replace(
    "className=\"bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-6 shadow\"",
    "className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow\""
)
code = code.replace(
    "text-gray-700 uppercase tracking-widest",
    "text-white/80 uppercase tracking-widest"
)

# Toggle styling
code = code.replace(
    "bg-white/50 border border-white/50",
    "bg-white/5 border border-white/10"
)
code = code.replace(
    "text-gray-800",
    "text-white"
)
code = code.replace(
    "bg-gray-200",
    "bg-white/20"
)

# Success state styling
code = code.replace(
    "text-gray-900",
    "text-white"
)
code = code.replace(
    "text-gray-600 hover:bg-gray-50",
    "text-white/80 hover:bg-white/10 border-white/20"
)
code = code.replace(
    "text-gray-500 text-sm mt-2",
    "text-gray-400 text-sm mt-2"
)
code = code.replace(
    "text-gray-500 text-sm",
    "text-gray-400 text-sm"
)

# Page background and wrapper
code = code.replace(
    "<div className=\"min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-6 md:px-16\">",
    "<AdminLayout activePage=\"events\">\n      <div className=\"py-10 px-8 max-w-5xl mx-auto\">"
)
code = code.replace(
    "<div className=\"min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6\">",
    "<AdminLayout activePage=\"events\">\n      <div className=\"min-h-[80vh] flex items-center justify-center px-6\">"
)

# Close AdminLayout tags correctly based on what was replaced
code = code.replace(
    "      </div>\n    </div>",
    "      </div>\n    </AdminLayout>"
)

# Remove background blobs (not needed in dark admin)
code = re.sub(r"\{\/\*\s*Background blobs\s*\*\/\}.*?<\/div>", "", code, flags=re.DOTALL)

# Header styling
code = code.replace(
    "text-gray-900 tracking-tight",
    "text-white tracking-tight"
)

# Cover upload box
code = code.replace(
    "border-blue-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50",
    "border-blue-500/30 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10"
)

with open('app/admin/events/create/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
