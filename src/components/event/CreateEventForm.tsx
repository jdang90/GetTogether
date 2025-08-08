'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createEvent } from '@/services/events'

export default function CreateEventForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('You must be logged in to create an event.')
      return
    }

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    if (!startDate || !endDate) {
      setError('Start and end dates are required.')
      return
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date.')
      return
    }

    setLoading(true)
    try {
      const newEvent = await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        host_id: user.id,
        start_date_range: startDate,
        end_date_range: endDate,
        is_public: isPublic,
      })
      router.push(`/event/${newEvent.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Event Title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input id="public" type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        <label htmlFor="public" className="text-sm">Public event</label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Creating…' : 'Create Event'}
      </button>
    </form>
  )
} 