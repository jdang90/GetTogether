'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getEvent } from '@/services/events'
import { getParticipants, joinEvent } from '@/services/participants'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/events'
import { Participant } from '@/types/participants'
import AvailabilityInput from '@/components/event/AvailabilityInput'
import Link from 'next/link'
import { deleteEvent } from '@/services/events'
import { useRouter } from 'next/navigation'

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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load event'
        setError(message)
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (user && event && participants.length > 0 && !participants.some(p => p.user_id === user.id)) {
      joinEvent(event.id, { user_id: user.id, name: user.email || undefined })
        .then(() => getParticipants(event.id).then(setParticipants))
        .catch(() => {})
    }
  }, [user, event]) // Remove participants from dependencies

  const router = useRouter()

  // Handler function for deleting an event
  const handleDelete = async () => {
    if (!event || !user) return // Add this safety check
    
    if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      return
    }
    
    setLoading(true)
    try {
      await deleteEvent(event.id, user.id) // Now safe without !
      router.push('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event'
      setError(message)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!event) return <div>Event not found</div>

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p className="mb-2">{event.description}</p>
          <p className="mb-2 text-sm text-black-500">
            Date Range: {event.start_date_range} to {event.end_date_range}
          </p>
        </div>
        {user?.id === event.host_id && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-2 rounded text-sm"
          >
            Delete Event
          </button>
        )}
      </div>
      
      <h2 className="font-semibold mt-6 mb-2">Participants</h2>
      <ul className="mb-4">
        {participants.map(p => (
          <li key={p.id}>{p.name || p.email || 'Anonymous'}</li>
        ))}
      </ul>
      
      <AvailabilityInput eventId={event.id} />
      
      <Link href={`/event/${event.id}/results`} className="text-blue-600 underline block mt-4">
        View Best Dates
      </Link>
    </div>
  )

}