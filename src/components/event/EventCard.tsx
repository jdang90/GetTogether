import Link from 'next/link'
import { Event } from '@/types/events'

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <Link href={`/event/${event.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
        {event.title}
      </Link>
      {event.description && (
        <p className="text-gray-600 mt-1">{event.description}</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        {event.start_date_range} – {event.end_date_range}
      </p>
    </div>
  )
} 