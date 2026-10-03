import re

with open('app/join/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Join GDG Platform button
join_platform_btn = r'<a\s*href="#"\s*className="flex items-center justify-between w-full md:w-max gap-8 bg-blue-600 text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-blue-700 transition-all hover:shadow-xl group"\s*>\s*Join GDG Platform <ArrowRight className="group-hover:translate-x-2 transition-transform" />\s*</a>'
new_join_btn = '<a\n              href="https://gdg.community.dev/gdg-on-campus-university-of-benin-benin-nigeria/"\n              target="_blank"\n              rel="noopener noreferrer"\n              className="flex items-center justify-between w-full md:w-max gap-8 bg-blue-600 text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-blue-700 transition-all hover:shadow-xl group"\n            >\n              Join GDG Platform <ArrowRight className="group-hover:translate-x-2 transition-transform" />\n            </a>'

c = re.sub(join_platform_btn, new_join_btn, c)

# Update Steps to have Action Links
steps_data = r"const steps = \[\s*\{ title: 'Sign up on GDG Platform', desc: 'Create your official Google Developer profile and join the UNIBEN chapter\.' \},\s*\{ title: 'Complete Local Form', desc: 'Fill out our chapter-specific intake form so we know your academic track\.' \},\s*\{ title: 'Select a Learning Track', desc: 'Choose between Web, Mobile, AI, or UI/UX Design to get specialized resources\.' \},\s*\{ title: 'Join the Community', desc: 'Get verified and receive your exclusive invite to our Discord and WhatsApp groups\.' \},\s*\];"

new_steps_data = """const steps = [
  { title: 'Sign up on GDG Platform', desc: 'Create your official Google Developer profile and join the UNIBEN chapter.', link: 'https://gdg.community.dev/gdg-on-campus-university-of-benin-benin-nigeria/', actionText: 'Go to Platform' },
  { title: 'Complete Local Form', desc: 'Fill out our chapter-specific intake form so we know your academic track.', link: '#', actionText: 'Intake Form (Coming Soon)' },
  { title: 'Select a Learning Track', desc: 'Choose between Web, Mobile, AI, or UI/UX Design to get specialized resources.', link: '/events', actionText: 'View Tracks / Events' },
  { title: 'Join the Community', desc: 'Get verified and receive your exclusive invite to our Discord and WhatsApp groups.', link: '#', actionText: 'Join Groups (Post-Registration)' },
];"""

c = re.sub(steps_data, new_steps_data, c)

# Update UI to render links
steps_ui = r'<h4 className="text-xl font-bold mb-2">\{step\.title\}<\/h4>\s*<p className="text-gray-500">\{step\.desc\}<\/p>'
new_steps_ui = """<h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-gray-500 mb-3">{step.desc}</p>
                    {step.link && (
                      <a href={step.link} target={step.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                        {step.actionText} <ArrowRight size={14} />
                      </a>
                    )}"""

c = re.sub(steps_ui, new_steps_ui, c)

with open('app/join/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
