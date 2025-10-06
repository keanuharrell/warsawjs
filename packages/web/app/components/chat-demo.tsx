'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  username: string
}

export function ChatDemo() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // TODO: Send via IoT
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      username: `User${Math.floor(Math.random() * 1000)}`,
    }
    setMessages((prev) => [...prev, newMessage])
    setMessage('')
  }

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
          messages.map((msg) => (
            <div key={msg.id} className="bg-accent rounded-lg px-4 py-2">
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
