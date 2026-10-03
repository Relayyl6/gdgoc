import re

with open('app/showcase/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_card = '<div onClick={() => setSelectedMemory(item)} className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-white">'
new_card = '<motion.div layoutId={`card-${item.id}`} onClick={() => setSelectedMemory(item)} className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-white">'
c = c.replace(old_card, new_card)

c = c.replace(
    '</div>\n            </motion.div>\n          ))}',
    '</motion.div>\n            </motion.div>\n          ))}'
)

old_modal = 'initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl z-10 max-h-[90vh]"'
new_modal = 'layoutId={`card-${selectedMemory.id}`} className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl z-10 max-h-[90vh]"'
c = c.replace(old_modal, new_modal)

with open('app/showcase/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
