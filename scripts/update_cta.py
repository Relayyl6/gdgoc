import re

with open('app/events/[id]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

new_block = """              {/* CTA Buttons */}
              {!event.isPast ? (
                <div className="space-y-3">
                  {event.isOnline && (event as any).meetingLink && (
                    <a
                      href={(event as any).meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r ${event.coverGradient} text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow`}
                    >
                      <Wifi className="w-4 h-4" />
                      Join Meeting
                    </a>
                  )}
                  {(event as any).bevyLink ? (
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`/api/events/click`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ eventId: event.id })
                          });
                        } catch(e) {}
                        window.location.href = (event as any).bevyLink;
                      }}
                      className={`block w-full text-center ${event.isOnline && (event as any).meetingLink ? 'bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50' : `bg-gradient-to-r ${event.coverGradient} text-white font-bold hover:opacity-90 shadow`} py-3 rounded-xl transition text-sm`}
                    >
                      Register Now
                    </button>
                  ) : (
                    <button disabled className="block w-full text-center bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed text-sm">
                      Registration Unavailable
                    </button>
                  )}
                  
                  {(event as any).allowSpeakers && (
                    <Link
                      href={`/events/${event.id}/register?role=speaker`}
                      className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      Register as Speaker
                    </Link>
                  )}
                  
                  {(event as any).allowTrainees && (
                    <Link
                      href={`/events/${event.id}/register?role=trainee`}
                      className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      Register as Trainee
                    </Link>
                  )}
                </div>
              ) : ("""

c = re.sub(r'\{\/\*\s*CTA Buttons\s*\*\/\}.*?\) : \(', new_block, c, flags=re.DOTALL)

with open('app/events/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
