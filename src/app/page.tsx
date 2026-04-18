'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { LoginForm } from '@/components/LoginForm'
import { SignupForm } from '@/components/SignupForm'

function HomeContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">CryptoTracker</h1>
          <p className="text-gray-400">Track your cryptocurrency wallets</p>
        </div>

        <Card>
          {registered && (
            <div className="mb-4 p-3 bg-accent/20 text-accent rounded-lg text-sm">
              Account created! Please sign in.
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </Card>
      </div>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}