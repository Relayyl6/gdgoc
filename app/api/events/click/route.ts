import { NextResponse } from 'next/server';
import { getCollection, saveDocument } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
    }

    const events = await getCollection('gdgoc_events') || [];
    const event = events.find((e: any) => e.id === eventId);
    
    if (event) {
      const newCount = (event.registeredCount || 0) + 1;
      // Preserve all unmapped properties natively
      const updatedEvent = { ...event, registeredCount: newCount };
      
      await saveDocument('gdgoc_events', eventId, updatedEvent);
      return NextResponse.json({ success: true, newCount });
    }
    
    return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
