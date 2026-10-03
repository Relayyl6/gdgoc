import re

# 1. Update app/layout.tsx
with open('app/layout.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_metadata = """export const metadata: Metadata = {
  title: "GDGOC UNIBEN",
  description: "Learn, build, and grow with a modern, animated, and tech-forward community platform.",
};"""

new_metadata = """export const metadata: Metadata = {
  title: "GDGOC UNIBEN | Google Developer Groups on Campus",
  description: "Join the Google Developer Groups on Campus at the University of Benin. Learn, build, and grow with a modern, tech-forward community platform.",
  icons: {
    icon: "/favicon.ico", // Ensure you have this or use a valid path if logo exists
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GDGOC UNIBEN",
    description: "Google Developer Groups on Campus at the University of Benin.",
    url: "https://gdgoc-uniben.vercel.app",
    siteName: "GDGOC UNIBEN",
    images: [
      {
        url: "https://developers.google.com/community/gdsc/images/gdsc-social-share.png", 
        width: 1200,
        height: 630,
        alt: "GDGOC Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};"""

c = c.replace(old_metadata, new_metadata)
with open('app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(c)


# 2. Update app/join/page.tsx
with open('app/join/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "title: 'Select a Learning Track', desc: 'Choose between Web, Mobile, AI, or UI/UX Design to get specialized resources.', link: '/events', actionText: 'View Tracks / Events' }",
    "title: 'Explore Our Events', desc: 'Attend our workshops, study jams, hackathons, and conferences to grow your skills.', link: '/events', actionText: 'View Events' }"
)

with open('app/join/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)


# 3. Update app/events/[id]/page.tsx
with open('app/events/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Card in the grid
old_card = """<motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMemory(item)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl border border-white/60 transition-all duration-300"
                >"""
new_card = """<motion.div
                  layoutId={`event-memory-${item.id}`}
                  key={item.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMemory(item)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl border border-white/60 transition-all duration-300"
                >"""
c = c.replace(old_card, new_card)

# Mobile hover fix for the card
old_hover = 'className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white"'
new_hover = 'className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white"'
c = c.replace(old_hover, new_hover)

# Modal wrapper
old_modal_div = """<div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >"""
new_modal_div = """<motion.div
                layoutId={`event-memory-${selectedMemory.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >"""
c = c.replace(old_modal_div, new_modal_div)

# Fix the closing tag of the modal
old_closing = """<Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Community Memory</span>
                </div>
              </div>
            </motion.div>"""
new_closing = """<Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Community Memory</span>
                </div>
              </motion.div>
            </motion.div>"""
c = c.replace(old_closing, new_closing)


with open('app/events/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
