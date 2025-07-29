'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { calculateBestDates } from '@/services/availability'

export default function EventResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [bestDates, setBestDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    calculateBestDates(id)
      .then(setBestDates)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Best Dates</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && bestDates.length === 0 && <p>No availability data yet.</p>}
      <ul>
        {bestDates.map(date => (
          <li key={date} className="mb-2 p-2 bg-green-100 rounded">{date}</li>
        ))}
      </ul>
    </div>
  )
}