'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WaitingRoom } from './waiting-room'
import { ChatDemo } from './chat-demo'
import { VoteDemo } from './vote-demo'
import { useRealtimeTopic } from '@/lib/realtime'
import type { ControlMessage } from '@warsawjs/core/realtime'

export function DemoClient() {
  const [mode, setMode] = useState<'waiting' | 'chat' | 'vote'>('waiting')
  const [loading, setLoading] = useState(true)

  // Load initial state from database
  useEffect(() => {
    fetch('/api/demo/state')
      .then(res => res.json())
      .then(data => {
        if (data.state) {
          setMode(data.state.mode || 'waiting')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load initial state:', err)
        setLoading(false)
      })
  }, [])

  // Listen to control messages from admin
  useRealtimeTopic<ControlMessage>('control', (message) => {
    switch (message.action) {
      case 'enable_chat':
        setMode('chat')
        break
      case 'enable_vote':
        setMode('vote')
        break
      case 'reset':
        setMode('waiting')
        break
    }
  })

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      {mode === 'waiting' && <WaitingRoom />}
      {mode === 'chat' && <ChatDemo />}
      {mode === 'vote' && <VoteDemo />}

      {/* Debug controls - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="fixed bottom-4 right-4 p-4">
          <p className="text-xs text-muted-foreground mb-2">Debug:</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMode('waiting')}>
              Waiting
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMode('chat')}>
              Chat
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMode('vote')}>
              Vote
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
