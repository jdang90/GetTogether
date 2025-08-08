'use client';

import CreateEventForm from '@/components/event/CreateEventForm'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Event</h1>
        <CreateEventForm />
      </div>
    </ProtectedRoute>
  );
}