'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRealtimeTopic } from '@/lib/realtime'
import type { ChatMessage } from '@warsawjs/core/realtime'

export function ChatDemo() {
  const [message, setMessage] = useState('')
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`)

  const { messages, publish } = useRealtimeTopic<ChatMessage>('chat')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      username,
      timestamp: Date.now(),
    }

    try {
      // Save to database
      await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatMessage),
      })

      // Publish to MQTT for real-time updates
      await publish(chatMessage)
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [message, username, publish])

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">💬 Live Chat</h2>
      <p className="text-lg text-muted-foreground mb-6">
        What's your favorite tech stack?
      </p>

      <Card className="p-4 h-96 overflow-y-auto mb-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">
            No messages yet. Be the first!
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className="bg-accent rounded-lg px-4 py-2">
              <span className="font-medium text-primary">{msg.username}:</span>{' '}
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength={100}
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
