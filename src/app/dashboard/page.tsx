'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserEvents } from '@/services/events'
import { useAuth } from '@/hooks/useAuth'
import { Event } from '@/types/events'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

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

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please log in to view your dashboard.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Sign Out */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Events</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.user_metadata?.name || user.email}!</p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded transition-colors"
        >
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      {/* Create Event Button */}
      <div className="mb-6">
        <Link 
          href="/event/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors inline-block"
        >
          + Create New Event
        </Link>
      </div>

      {/* Events List */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading your events...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && events.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't created or joined any events yet.</p>
          <Link 
            href="/event/create" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create your first event
          </Link>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="grid gap-4">
          {events.map(event => (
            <div key={event.id} className="bg-white shadow rounded-lg p-4 border">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              {/* Add more event details here as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}