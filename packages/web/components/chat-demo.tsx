'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRealtimeTopic } from '@/lib/realtime'
import { useUsername } from '@/lib/use-username'
import { UsernamePrompt } from './username-prompt'
import type { ChatMessage } from '@warsawjs/core/realtime'

export function ChatDemo() {
  const [message, setMessage] = useState('')
  const { username, isLoading, saveUsername, hasUsername } = useUsername()

  const { messages, publish } = useRealtimeTopic<ChatMessage>('chat')

  // Show username prompt if no username is set
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  if (!hasUsername) {
    return <UsernamePrompt onSubmit={saveUsername} />
  }

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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold">💬 Live Chat</h2>
        <span className="text-sm text-muted-foreground">
          Chatting as <span className="font-medium text-primary">{username}</span>
        </span>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        What&apos;s your favorite tech stack?
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
