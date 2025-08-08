'use client'

import { useParams } from 'next/navigation'

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <p className="text-gray-600">Editing for event ID: {id}</p>
      <p className="mt-2">Edit form coming soon.</p>
    </div>
  )
} 