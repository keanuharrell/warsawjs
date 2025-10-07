<script setup lang="ts">
import { computed } from 'vue'
import { useMqttTopic, type VoteMessage } from '../composables/useMqtt'

type VoteOption = 'A' | 'B' | 'C' | 'D'

const options = [
  { id: 'A' as const, text: 'IAM Permissions 🔐', color: '#3b82f6' },
  { id: 'B' as const, text: 'Understanding the Bill 💸', color: '#10b981' },
  { id: 'C' as const, text: 'Finding the Right Service 🔍', color: '#f59e0b' },
  { id: 'D' as const, text: 'All of the Above 😅', color: '#ef4444' },
]

const { messages, connected } = useMqttTopic<VoteMessage>('vote')

// Count votes per option
const results = computed(() => {
  const counts: Record<VoteOption, number> = { A: 0, B: 0, C: 0, D: 0 }

  // Count unique users' votes (last vote wins)
  const userVotes = new Map<string, VoteOption>()
  messages.value.forEach((msg) => {
    userVotes.set(msg.userId, msg.option)
  })

  userVotes.forEach((option) => {
    counts[option]++
  })

  return counts
})

const total = computed(() => {
  return Object.values(results.value).reduce((a, b) => a + b, 0)
})

const percentage = (option: VoteOption) => {
  if (total.value === 0) return 0
  return Math.round((results.value[option] / total.value) * 100)
}
</script>

<template>
  <div class="live-vote">
    <div class="header">
      <h3>🗳️ Live Poll Results</h3>
      <span class="status" :class="{ connected }">
        {{ connected ? '● Live' : '○ Offline' }}
      </span>
    </div>

    <div class="question">
      What's the hardest part of AWS?
    </div>

    <div class="results">
      <div
        v-for="option in options"
        :key="option.id"
        class="option"
      >
        <div class="option-label">
          <span class="option-id">{{ option.id }}</span>
          <span class="option-text">{{ option.text }}</span>
        </div>

        <div class="bar-container">
          <div
            class="bar"
            :style="{
              width: `${percentage(option.id)}%`,
              backgroundColor: option.color,
            }"
          />
        </div>

        <div class="stats">
          <span class="percentage">{{ percentage(option.id) }}%</span>
          <span class="count">({{ results[option.id] }})</span>
        </div>
      </div>
    </div>

    <div class="total">
      Total votes: {{ total }}
    </div>
  </div>
</template>

<style scoped>
.live-vote {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 1.5rem;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.status {
  font-size: 0.9rem;
  color: #666;
}

.status.connected {
  color: #4ade80;
}

.question {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #e5e7eb;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-id {
  font-weight: bold;
  font-size: 1.2rem;
  color: #60a5fa;
}

.option-text {
  font-size: 1rem;
  color: #e5e7eb;
}

.bar-container {
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 4px;
}

.stats {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.percentage {
  font-weight: bold;
  color: #60a5fa;
}

.count {
  color: #9ca3af;
}

.total {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
