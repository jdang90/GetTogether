import { supabase } from '@/lib/supabase/supabaseClient'
import { Event } from '@/types/events'

// Create a new event
export async function createEvent(eventData: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Fetch an event by ID
export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Update an event
export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Delete an event
export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// Get events where user is host or participant
export async function getUserEvents(userId: string) {
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
  const participated = (participatedRows ?? [])
    .map((row: any) => row.events)
    .filter(Boolean);

  return { hosted: hosted ?? [], participated };
}
