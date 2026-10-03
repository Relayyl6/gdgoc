'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Mic, GraduationCap, Download, Share, QrCode
} from 'lucide-react';
import { getCollection } from '@/lib/db';
import html2canvas from 'html2canvas';

export default function RegisterPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const initRole = searchParams?.get('role') as 'speaker' | 'trainee' | null;

  const [event, setEvent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'speaker' | 'trainee'>(initRole || 'trainee');
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(''); // Topic or Track

  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [ticketDataUrl, setTicketDataUrl] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCollection('gdgoc_events').then((stored) => {
      if (stored) {
        const found = stored.find((e: any) => e.id === params.id);
        if (found) setEvent(found);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Generate ticket
    if (ticketRef.current) {
      // Temporarily make it visible for html2canvas
      ticketRef.current.style.display = 'block';
      try {
        const canvas = await html2canvas(ticketRef.current, { backgroundColor: null, scale: 2 });
        setTicketDataUrl(canvas.toDataURL('image/png'));
        setTicketGenerated(true);
      } catch (err) {
        console.error('Failed to generate ticket', err);
        alert('Could not generate ticket. Please try again.');
      }
      ticketRef.current.style.display = 'none';
    }
  };

  const handleDownload = () => {
    if (!ticketDataUrl) return;
    const a = document.createElement('a');
    a.href = ticketDataUrl;
    a.download = `GDGOC_Ticket_${name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  if (loading) return <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center font-semibold text-gray-500">Loading...</div>;
  
  if (!event) return (
    <div className="min-h-screen pt-24 bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
      <Link href="/events" className="text-blue-600 hover:underline">Back to Events</Link>
    </div>
  );

  const getLink = () => {
    return activeTab === 'speaker' ? event.speakerLink : event.traineeLink;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Join as {activeTab === 'speaker' ? 'Speaker' : 'Trainee'}</h1>
          <p className="text-gray-500">{event.title}</p>
        </div>

        {!ticketGenerated ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
              <button type="button" onClick={() => setActiveTab('speaker')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'speaker' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                <Mic className="w-4 h-4" /> Speaker
              </button>
              <button type="button" onClick={() => setActiveTab('trainee')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'trainee' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                <GraduationCap className="w-4 h-4" /> Trainee
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {activeTab === 'speaker' ? 'What topic are you speaking on?' : 'Which track are you interested in?'}
                </label>
                <input required type="text" value={topic} onChange={e=>setTopic(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder={activeTab === 'speaker' ? 'e.g. AI in Healthcare' : 'e.g. Web Development'} />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mt-4">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 font-medium">
                  We value your privacy. No personal data is collected or stored on our servers. Generating your pass is entirely local!
                </p>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition mt-6">
                Generate My Pass
              </button>
            </form>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Pass Generated!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Please download your pass. You will need to show this pass in the WhatsApp group to verify your role.
            </p>

            {/* Display the generated image */}
            <div className="flex justify-center mb-8">
              <img src={ticketDataUrl} alt="Your Event Pass" className="max-w-full h-auto rounded-2xl shadow-xl border border-gray-200" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                <Download className="w-5 h-5" /> Download Pass
              </button>
              
              {getLink() ? (
                <a href={getLink()} target="_blank" className="flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
                  <Share className="w-5 h-5" /> Join WhatsApp
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-8 py-3.5 rounded-xl font-bold cursor-not-allowed">
                  No WhatsApp Link Provided
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden Ticket Template for html2canvas */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={ticketRef} style={{ width: '400px', padding: '24px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '24px', color: 'white', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, marginBottom: '4px' }}>GDGOC UNIBEN</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '1.2' }}>{event?.title}</div>
            </div>
            <QrCode style={{ width: '48px', height: '48px', opacity: 0.9 }} />
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>NAME</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>{name}</div>
            
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>ROLE</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'capitalize' }}>{activeTab}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>{activeTab === 'speaker' ? 'TOPIC' : 'TRACK'}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{topic}</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.8 }}>
            <div>{event?.date}</div>
            <div>{event?.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
