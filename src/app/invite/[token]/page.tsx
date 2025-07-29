'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEvent } from '@/services/events'
import { joinEvent } from '@/services/participants'
import { useAuth } from '@/hooks/useAuth'

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const { user } = useAuth()
  const router = useRouter()
  const [eventId, setEventId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)
      try {
        // Find event by invite token
        const event = await getEventByToken(token)
        setEventId(event.id)
        if (user) {
          await joinEvent(event.id, { user_id: user.id, name: user.email })
          router.push(`/event/${event.id}`)
        }
      } catch (err: any) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetchEvent()
  }, [token, user, router])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!eventId) return <div>Invalid invite link.</div>
  return <div>Joining event...</div>
}

// Helper to get event by invite token
async function getEventByToken(token: string) {
  const { data, error } = await import('@/lib/supabase/supabaseClient').then(({ supabase }) =>
    supabase.from('events').select('*').eq('invite_token', token).single()
  )
  if (error || !data) throw new Error('Invalid or expired invite link')
  return data
}
