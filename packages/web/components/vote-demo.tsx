'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRealtimeTopic } from '@/lib/realtime'
import type { VoteMessage } from '@warsawjs/core/realtime'

type VoteOption = 'A' | 'B' | 'C' | 'D'
type VoteResults = Record<VoteOption, number>

const options = [
  { id: 'A' as const, text: 'IAM Permissions 🔐' },
  { id: 'B' as const, text: 'Understanding the Bill 💸' },
  { id: 'C' as const, text: 'Finding the Right Service 🔍' },
  { id: 'D' as const, text: 'All of the Above 😅' },
]

export function VoteDemo() {
  const [voted, setVoted] = useState(false)
  const [userVote, setUserVote] = useState<VoteOption | null>(null)
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)
  const [initialVotes, setInitialVotes] = useState<VoteResults>({ A: 0, B: 0, C: 0, D: 0 })
  const [loading, setLoading] = useState(true)

  const { messages, publish } = useRealtimeTopic<VoteMessage>('vote')

  // Load existing votes from database on mount
  useEffect(() => {
    fetch('/api/demo/vote')
      .then(res => res.json())
      .then(data => {
        if (data.votes) {
          setInitialVotes(data.votes)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load votes:', err)
        setLoading(false)
      })
  }, [])

  // Calculate results from initial votes + real-time messages
  const results = useMemo(() => {
    const counts: VoteResults = { ...initialVotes }
    messages.forEach((msg) => {
      counts[msg.option] = (counts[msg.option] || 0) + 1
    })
    return counts
  }, [messages, initialVotes])

  const handleVote = useCallback(async (optionId: VoteOption) => {
    const voteMessage: VoteMessage = {
      option: optionId,
      userId,
      timestamp: Date.now(),
    }

    try {
      // Save to database (upsert will update if already exists)
      await fetch('/api/demo/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voteMessage),
      })

      // Publish to MQTT for real-time updates
      await publish(voteMessage)
      setVoted(true)
      setUserVote(optionId)
    } catch (error) {
      console.error('Failed to submit vote:', error)
    }
  }, [userId, publish])

  const total = Object.values(results).reduce((a, b) => a + b, 0)
  const percentage = (option: VoteOption) =>
    total > 0 ? Math.round((results[option] / total) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">🗳️ Live Poll</h2>
      <p className="text-xl mb-8">What&apos;s the hardest part of AWS?</p>

      <div className="space-y-4">
        {options.map((option) => {
          const pct = percentage(option.id)
          const count = results[option.id]

          return (
            <Button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={loading}
              variant={userVote === option.id ? "default" : "outline"}
              className="w-full h-auto p-0 relative overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex justify-between items-center w-full p-4">
                <span className="text-lg font-medium">
                  {option.id}) {option.text}
                </span>
                {voted && (
                  <span className="text-2xl font-bold">
                    {pct}%
                    <span className="text-sm ml-2 opacity-75">({count})</span>
                  </span>
                )}
              </div>
            </Button>
          )
        })}
      </div>

      {voted && (
        <div className="text-center mt-6">
          <p className="text-green-600 font-medium">
            ✓ Thanks for voting! Total votes: {total}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You can change your vote by clicking another option
          </p>
        </div>
      )}
    </div>
  )
}
