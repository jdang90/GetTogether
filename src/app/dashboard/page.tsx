'use client'
import { useEffect, useState } from 'react'
import { getUserEvents } from '@/services/events'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/events'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setLoading(true)
      getUserEvents(user.id)
        .then(({ hosted, participated }) => {
          setEvents([...hosted, ...participated])
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [user])

  return (
    <div>
      <h1>Your Events</h1>
      <Link href="/event/create" className="text-blue-600 underline">+ Create New Event</Link>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}
