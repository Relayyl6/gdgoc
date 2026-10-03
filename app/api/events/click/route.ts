import { NextResponse } from 'next/server';
import { getCollection, saveCollection } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
    }

    const events = await getCollection('gdgoc_events') || [];
    const idx = events.findIndex((e: any) => e.id === eventId);
    
    if (idx !== -1) {
      events[idx].registeredCount = (events[idx].registeredCount || 0) + 1;
      await saveCollection('gdgoc_events', events);
      return NextResponse.json({ success: true, newCount: events[idx].registeredCount });
    }
    
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
