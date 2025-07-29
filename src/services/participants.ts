import { supabase } from '@/lib/supabase/supabaseClient'
import { Participant } from '@/types/participants'

// Join event as participant
export async function joinEvent(eventId: string, userData: Partial<Participant>) {
  const { data, error } = await supabase
    .from('participants')
    .insert([{ event_id: eventId, ...userData }])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// Get all participants for an event
export async function getParticipants(eventId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('event_id', eventId)
  if (error) throw new Error(error.message)
  return data || []
}