'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out failed', error)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <nav className="flex items-center gap-3">
      {user ? (
        <>
          <Link href="/dashboard" className="text-sm text-gray-700 hover:text-black">Dashboard</Link>
          <Link href="/event/create" className="text-sm text-gray-700 hover:text-black">Create Event</Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-60"
          >
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm text-gray-700 hover:text-black">Login</Link>
          <Link href="/signup" className="text-sm text-gray-700 hover:text-black">Sign Up</Link>
        </>
      )}
    </nav>
  )
} 