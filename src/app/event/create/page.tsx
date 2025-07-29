'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !startDate || !endDate) {
      setError('Title and date range are required.');
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase.from('events').insert([
      {
        title,
        description,
        host_id: user?.id,
        start_date_range: startDate,
        end_date_range: endDate,
        is_public: false,
      },
    ]).select().single();

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    // Redirect to the new event page
    router.push(`/event/${data.id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleCreate} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Event Title"
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <div className="flex gap-2">
          <input
            className="border px-3 py-2 rounded w-1/2"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            className="border px-3 py-2 rounded w-1/2"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}