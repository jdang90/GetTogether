import { supabase } from '@/lib/supabase/supabaseClient'
import { Event } from '@/types/events'

// Create a new event
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message || 'Failed to create event')
  return data as Event
}

// Fetch an event by ID
export async function getEvent(id: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) throw new Error(error?.message || 'Event not found')
  return data as Event
}

// Update an event
export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message || 'Failed to update event')
  return data as Event
}

// Delete an event (updated with authorization check)
export async function deleteEvent(id: string, userId?: string): Promise<void> {
  // Optional: verify user owns the event for extra security
  if (userId) {
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', id)
      .single()
    
    if (fetchError) throw new Error('Event not found')
    if (event.host_id !== userId) throw new Error('Not authorized to delete this event')
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// Get events where user is host or participant
export async function getUserEvents(userId: string): Promise<{ hosted: Event[]; participated: Event[] }> {
  // Hosted events
  const { data: hosted, error: hostedError } = await supabase
    .from('events')
    .select('*')
    .eq('host_id', userId);

  if (hostedError) throw new Error(hostedError.message);

  // Participated events (join participants table)
  const { data: participatedRows, error: participatedError } = await supabase
    .from('participants')
    .select('event_id, events(*)')
    .eq('user_id', userId);

  if (participatedError) throw new Error(participatedError.message);

  // Extract event objects from joined rows
  const participated = ((participatedRows ?? []) as unknown as Array<{ event_id: string; events: Event | null }>)
    .map(row => row.events)
    .filter((e): e is Event => Boolean(e));

  return { hosted: (hosted as Event[]) ?? [], participated };
}
