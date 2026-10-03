'use server';

import { getCollection, saveCollection } from '@/lib/db';

export async function incrementEventClick(eventId: string) {
  try {
    const events = await getCollection('gdgoc_events') || [];
    const idx = events.findIndex((e: any) => e.id === eventId);
    
    if (idx !== -1) {
      events[idx].registeredCount = (events[idx].registeredCount || 0) + 1;
      await saveCollection('gdgoc_events', events);
      return { success: true };
    }
    return { success: false, error: 'Event not found' };
  } catch (error) {
    console.error('Failed to increment click:', error);
    return { success: false };
  }
}
