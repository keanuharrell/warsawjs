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
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)

  const { messages, publish } = useRealtimeTopic<VoteMessage>('vote')

  // Calculate results from all vote messages
  const results = useMemo(() => {
    const counts: VoteResults = { A: 0, B: 0, C: 0, D: 0 }
    messages.forEach((msg) => {
      counts[msg.option] = (counts[msg.option] || 0) + 1
    })
    return counts
  }, [messages])

  const handleVote = useCallback(async (optionId: VoteOption) => {
    if (voted) return

    const voteMessage: VoteMessage = {
      option: optionId,
      userId,
      timestamp: Date.now(),
    }

    try {
      await publish(voteMessage)
      setVoted(true)
    } catch (error) {
      console.error('Failed to submit vote:', error)
    }
  }, [voted, userId, publish])

  const total = Object.values(results).reduce((a, b) => a + b, 0)
  const percentage = (option: VoteOption) =>
    total > 0 ? Math.round((results[option] / total) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">🗳️ Live Poll</h2>
      <p className="text-xl mb-8">What's the hardest part of AWS?</p>

      <div className="space-y-4">
        {options.map((option) => {
          const pct = percentage(option.id)
          const count = results[option.id]

          return (
            <Button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              variant="outline"
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
        <p className="text-center mt-6 text-green-600 font-medium">
          ✓ Thanks for voting! Total votes: {total}
        </p>
      )}
    </div>
  )
}
