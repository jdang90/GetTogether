'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getAvailability, setAvailability } from '@/services/availability'

interface Props {
  eventId: string
}

export default function AvailabilityInput({ eventId }: Props) {
  const { user } = useAuth()
  const [dates, setDates] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch allowed date range from event (optional: pass as props for optimization)
  useEffect(() => {
    // For MVP, just allow manual input or fetch from event if needed
    // Here, we assume a fixed range for demo
    const today = new Date()
    const range = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d.toISOString().slice(0, 10)
    })
    setDates(range)
  }, [])

  useEffect(() => {
    if (user) {
      getAvailability(eventId, user.id).then(setSelected)
    }
  }, [eventId, user])

  const toggleDate = (date: string) => {
    setSelected(sel =>
      sel.includes(date) ? sel.filter(d => d !== date) : [...sel, date]
    )
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      await setAvailability(eventId, user!.id, selected)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Your Availability</h3>
      <div className="flex gap-2 flex-wrap mb-2">
        {dates.map(date => (
          <button
            key={date}
            type="button"
            className={`px-2 py-1 rounded border ${selected.includes(date) ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => toggleDate(date)}
          >
            {date}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  )
}