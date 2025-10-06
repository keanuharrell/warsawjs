'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function AdminDashboard() {
  const [chatEnabled, setChatEnabled] = useState(false)
  const [voteEnabled, setVoteEnabled] = useState(false)

  const handleEnableChat = async () => {
    // TODO: Publish to IoT Control topic
    console.log('Publishing: enable_chat')
    setChatEnabled(true)
  }

  const handleEnableVote = async () => {
    // TODO: Publish to IoT Control topic
    console.log('Publishing: enable_vote')
    setVoteEnabled(true)
  }

  const handleReset = async () => {
    // TODO: Publish to IoT Control topic
    console.log('Publishing: reset')
    setChatEnabled(false)
    setVoteEnabled(false)
  }

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
            <Badge variant="outline" className="text-green-600 border-green-600">
              ✓ Connected
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
