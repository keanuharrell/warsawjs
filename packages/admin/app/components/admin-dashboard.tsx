'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRealtimeTopic, useRealtimeConnection } from '@/lib/realtime'
import type { ControlMessage } from '@warsawjs/core/realtime'

export function AdminDashboard() {
  const [chatEnabled, setChatEnabled] = useState(false)
  const [voteEnabled, setVoteEnabled] = useState(false)

  const { connected } = useRealtimeConnection()
  const { publish } = useRealtimeTopic<ControlMessage>('control', (message) => {
    // Listen to control messages to sync state
    switch (message.action) {
      case 'enable_chat':
        setChatEnabled(true)
        break
      case 'enable_vote':
        setVoteEnabled(true)
        break
      case 'reset':
        setChatEnabled(false)
        setVoteEnabled(false)
        break
    }
  })

  const handleEnableChat = useCallback(async () => {
    console.log('[Admin] Attempting to enable chat, connected:', connected)
    const message: ControlMessage = {
      action: 'enable_chat',
      timestamp: Date.now(),
    }
    try {
      // Save state to database (web app has the API routes)
      await fetch(`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/api/demo/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', chatEnabled: true }),
      })

      // Publish to MQTT for real-time updates
      console.log('[Admin] Publishing message:', message)
      await publish(message)
      console.log('[Admin] Message published successfully')
      setChatEnabled(true)
    } catch (error) {
      console.error('[Admin] Failed to enable chat:', error)
    }
  }, [publish, connected])

  const handleEnableVote = useCallback(async () => {
    const message: ControlMessage = {
      action: 'enable_vote',
      timestamp: Date.now(),
    }
    try {
      // Save state to database
      await fetch(`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/api/demo/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'vote', voteEnabled: true }),
      })

      // Publish to MQTT
      await publish(message)
      setVoteEnabled(true)
    } catch (error) {
      console.error('Failed to enable vote:', error)
    }
  }, [publish])

  const handleReset = useCallback(async () => {
    const message: ControlMessage = {
      action: 'reset',
      timestamp: Date.now(),
    }
    try {
      // Reset database
      await fetch(`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/api/demo/reset`, {
        method: 'POST',
      })

      // Publish to MQTT
      await publish(message)
      setChatEnabled(false)
      setVoteEnabled(false)
    } catch (error) {
      console.error('Failed to reset:', error)
    }
  }, [publish])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">WarsawJS Admin Panel</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Control panel for live demo
              </p>
            </div>
            <Badge
              variant="outline"
              className={connected ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}
            >
              {connected ? '✓ Connected' : '✗ Disconnected'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Demo Status</CardTitle>
            <CardDescription>Current state of the public site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${chatEnabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm">Chat {chatEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${voteEnabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm">Vote {voteEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>Activate features on the public site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat Control */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">💬 Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Enable real-time chat for the audience
                </p>
              </div>
              <Button
                onClick={handleEnableChat}
                disabled={chatEnabled}
                variant={chatEnabled ? 'outline' : 'default'}
              >
                {chatEnabled ? 'Active' : 'Enable Chat'}
              </Button>
            </div>

            <Separator />

            {/* Vote Control */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">🗳️ Live Vote</h3>
                <p className="text-sm text-muted-foreground">
                  Start the AWS difficulty poll
                </p>
              </div>
              <Button
                onClick={handleEnableVote}
                disabled={voteEnabled}
                variant={voteEnabled ? 'outline' : 'default'}
              >
                {voteEnabled ? 'Active' : 'Enable Vote'}
              </Button>
            </div>

            <Separator />

            {/* Reset */}
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-500/20">
              <div>
                <h3 className="font-medium text-red-600">🔄 Reset All</h3>
                <p className="text-sm text-muted-foreground">
                  Return to waiting room
                </p>
              </div>
              <Button
                onClick={handleReset}
                variant="destructive"
                disabled={!chatEnabled && !voteEnabled}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common presentation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  handleReset()
                  setTimeout(handleEnableChat, 500)
                }}
              >
                Demo Chat Only
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleReset()
                  setTimeout(handleEnableVote, 500)
                }}
              >
                Demo Vote Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Admin Panel • WarsawJS 2025</p>
          <p className="mt-1">Public Site: warsawjs.keanuharrell.com</p>
        </div>
      </main>
    </div>
  )
}
