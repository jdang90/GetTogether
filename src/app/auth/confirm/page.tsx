'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'

export default function ConfirmEmail() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Error confirming email:', error)
            setStatus('error')
            setMessage('Failed to confirm email. Please try again.')
          } else {
            setStatus('success')
            setMessage('Email confirmed successfully! Redirecting...')
            // Redirect to dashboard after a brief delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        } else {
          setStatus('error')
          setMessage('Invalid confirmation link.')
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred.')
      }
    }

    handleEmailConfirmation()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Confirmation
          </h2>
          <div className="mt-4">
            {status === 'loading' && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-2 text-gray-600">Confirming your email...</p>
              </div>
            )}
            {status === 'success' && (
              <div className="text-green-600">
                <p>{message}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="text-red-600">
                <p>{message}</p>
                <button 
                  onClick={() => router.push('/login')}
                  className="mt-4 text-blue-600 hover:text-blue-500"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}