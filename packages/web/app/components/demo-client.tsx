'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WaitingRoom } from './waiting-room'
import { ChatDemo } from './chat-demo'
import { VoteDemo } from './vote-demo'

export function DemoClient() {
  const [mode, setMode] = useState<'waiting' | 'chat' | 'vote'>('waiting')

  // TODO: Listen to IoT control topic
  // useEffect(() => {
  //   const client = mqtt.connect(config.controlTopicEndpoint)
  //   client.on('message', (topic, msg) => {
  //     const data = JSON.parse(msg.toString())
  //     if (data.action === 'enable_chat') setMode('chat')
  //     if (data.action === 'enable_vote') setMode('vote')
  //   })
  // }, [])

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
