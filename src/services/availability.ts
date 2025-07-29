import { supabase } from '@/lib/supabase/client'

// Get availability for a participant
export async function getAvailability(eventId: string, userId: string) {
  // Find participant ID
  const { data: participant } = await supabase
    .from('participants')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()
  if (!participant) return []

  // Get availability dates
  const { data, error } = await supabase
    .from('availability')
    .select('date')
    .eq('participant_id', participant.id)
    .eq('is_available', true)
  if (error) throw new Error(error.message)
  return data.map((row: any) => row.date)
}

// Set availability for a participant (overwrite all)
export async function setAvailability(eventId: string, userId: string, dates: string[]) {
  // Find participant ID
  const { data: participant } = await supabase
    .from('participants')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()
  if (!participant) throw new Error('Participant not found')

  // Remove old availability
  await supabase
    .from('availability')
    .delete()
    .eq('participant_id', participant.id)

  // Insert new availability
  if (dates.length > 0) {
    const rows = dates.map(date => ({
      participant_id: participant.id,
      date,
      is_available: true,
    }))
    const { error } = await supabase.from('availability').insert(rows)
    if (error) throw new Error(error.message)
  }
}