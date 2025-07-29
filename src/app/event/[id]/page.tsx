'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getEvent } from '@/services/events'
import { getParticipants, joinEvent } from '@/services/participants'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/events'
import { Participant } from '@/types/participants'
import AvailabilityInput from '@/components/event/AvailabilityInput'

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const eventData = await getEvent(id)
        setEvent(eventData)
        const participantData = await getParticipants(id)
        setParticipants(participantData)
      } catch (err: any) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  // Optionally, auto-join user as participant if not already
  useEffect(() => {
    if (user && event && !participants.some(p => p.user_id === user.id)) {
      joinEvent(event.id, { user_id: user.id, name: user.email })
        .then(() => getParticipants(event.id).then(setParticipants))
    }
  }, [user, event, participants])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!event) return <div>Event not found</div>

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="mb-2 text-sm text-gray-500">
        Date Range: {event.start_date_range} to {event.end_date_range}
      </p>
      <h2 className="font-semibold mt-6 mb-2">Participants</h2>
      <ul className="mb-4">
        {participants.map(p => (
          <li key={p.id}>{p.name || p.email || 'Anonymous'}</li>
        ))}
      </ul>
      <AvailabilityInput eventId={event.id} />
    </div>
  )
}