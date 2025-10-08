'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WaitingRoom } from './waiting-room'
import { ChatDemo } from './chat-demo'
import { VoteDemo } from './vote-demo'
import { EmailDemo } from './email-demo'
import { UsernamePrompt } from './username-prompt'
import { useRealtimeTopic } from '@/lib/realtime'
import { useUsername } from '@/lib/use-username'
import type { ControlMessage, ChatMessage, StepId, VoteResults } from '@warsawjs/core'

interface DemoClientProps {
  initialMode?: StepId
  initialMessages: ChatMessage[]
  initialVotes: VoteResults
}

export function DemoClient({
  initialMode = 'waiting',
  initialMessages,
  initialVotes
}: DemoClientProps) {
  const [mode, setMode] = useState<StepId>(initialMode)
  const { isLoading, saveUsername, hasUsername } = useUsername()

  // Listen to control messages from admin - MUST be called before any conditional returns
  useRealtimeTopic<ControlMessage>('control', (message) => {
    switch (message.action) {
      case 'enable_chat':
        setMode('chat')
        break
      case 'enable_vote':
        setMode('vote')
        break
      case 'enable_email':
        setMode('email')
        break
      case 'reset':
        setMode('waiting')
        break
    }
  })

  // Show username prompt at the very beginning if no username
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  if (!hasUsername) {
    return <UsernamePrompt onSubmit={saveUsername} />
  }

  // Render the appropriate component based on mode with proper typing
  const renderStep = () => {
    switch (mode) {
      case 'waiting':
        return <WaitingRoom />
      case 'chat':
        return <ChatDemo initialMessages={initialMessages} />
      case 'vote':
        return <VoteDemo initialVotes={initialVotes} />
      case 'email':
        return <EmailDemo />
    }
  }

  return (
    <>
      {renderStep()}

      {/* Debug controls - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="fixed bottom-4 right-4 p-4">
          <p className="text-xs text-muted-foreground mb-2">Debug:</p>
          <div className="flex gap-2">
            {(['waiting', 'chat', 'vote', 'email'] as const).map((stepId) => (
              <Button
                key={stepId}
                variant="outline"
                size="sm"
                onClick={() => setMode(stepId)}
              >
                {stepId}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}
