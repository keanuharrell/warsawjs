'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function EmailDemo() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/demo/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send email')
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email')
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Main Thank You Message */}
      <div className="mb-12">
        <div className="text-8xl mb-6 animate-bounce">🙏</div>
        <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
        <p className="text-2xl text-muted-foreground mb-6">
          Thanks for joining this WarsawJS × SST presentation
        </p>
        <div className="flex justify-center gap-4 text-lg">
          <span>🇵🇱 Warsaw</span>
          <span>•</span>
          <span>⚡ SST</span>
          <span>•</span>
          <span>🚀 Serverless</span>
        </div>
      </div>

      {/* Highlights */}
      <Card className="p-8 mb-8 bg-accent/30">
        <h2 className="text-2xl font-bold mb-6">What we covered today</h2>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-semibold">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">MQTT + AWS IoT Core</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🗳️</span>
            <div>
              <h3 className="font-semibold">Live Voting</h3>
              <p className="text-sm text-muted-foreground">Interactive polls</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-sm text-muted-foreground">AWS Cognito</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <h3 className="font-semibold">Email Service</h3>
              <p className="text-sm text-muted-foreground">AWS SES</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Email Section */}
      <Card className="p-8">
        {status === 'success' ? (
          <div className="py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">Check your inbox!</h3>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent you a detailed recap with resources and next steps.
            </p>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Send to another email
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Want to learn more?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a detailed recap with links, resources, and next steps sent to your inbox (optional)
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="text-lg py-6"
              />

              {status === 'error' && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send me the recap 📧'}
              </Button>

              <p className="text-xs text-muted-foreground">
                No spam, just useful resources. Promise! 🤝
              </p>
            </form>
          </>
        )}
      </Card>

      {/* Footer */}
      <div className="mt-12 text-muted-foreground">
        <p className="mb-2">Built with SST, Next.js, AWS IoT, DynamoDB, and SES</p>
        <p className="text-sm">Keanu Harrell • WarsawJS 2025</p>
      </div>
    </div>
  )
}
