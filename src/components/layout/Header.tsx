'use client'

import Link from 'next/link'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          GetTogether
        </Link>
        <Navigation />
      </div>
    </header>
  )
} 