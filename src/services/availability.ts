import { supabase } from '@/lib/supabase/supabaseClient'

// Get availability for a participant
export async function getAvailability(eventId: string, userId: string): Promise<string[]> {
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
  return (data as { date: string }[]).map(row => row.date)
}

export async function calculateBestDates(eventId: string): Promise<string[]> {
  // Get all participants for the event
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('id')
    .eq('event_id', eventId)
  if (participantsError) throw new Error(participantsError.message)
  const participantIds = (participants ?? []).map(p => p.id as string)
  if (participantIds.length === 0) return []

  // Get all availability for these participants
  const { data: availability, error: availError } = await supabase
    .from('availability')
    .select('date, participant_id')
    .in('participant_id', participantIds)
    .eq('is_available', true)
  if (availError) throw new Error(availError.message)

  // Count available participants per date
  const dateCounts: Record<string, number> = {}
  for (const row of (availability ?? []) as { date: string; participant_id: string }[]) {
    dateCounts[row.date] = (dateCounts[row.date] || 0) + 1
  }

  // Find max count
  const max = Math.max(0, ...Object.values(dateCounts))
  // Return all dates with max count
  return Object.entries(dateCounts)
    .filter(([, count]) => count === max)
    .map(([date]) => date)
}

// Set availability for a participant (overwrite all)
export async function setAvailability(eventId: string, userId: string, dates: string[]): Promise<void> {
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
      participant_id: participant.id as string,
      date,
      is_available: true,
    }))
    const { error } = await supabase.from('availability').insert(rows)
    if (error) throw new Error(error.message)
  }
}