<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useMqttTopic } from '../composables/useMqtt'

type VoteOption = 'A' | 'B' | 'C' | 'D'
type VoteResults = Record<VoteOption, number>

interface ControlMessage {
  action: 'enable_chat' | 'enable_vote' | 'enable_email' | 'reset'
  timestamp: number
}

const options = [
  { id: 'A' as const, text: 'IAM Permissions 🔐', color: '#3b82f6' },
  { id: 'B' as const, text: 'Understanding the Bill 💸', color: '#10b981' },
  { id: 'C' as const, text: 'Finding the Right Service 🔍', color: '#f59e0b' },
  { id: 'D' as const, text: 'All of the Above 😅', color: '#ef4444' },
]

const { connected } = useMqttTopic('vote')
const votes = ref<VoteResults>({ A: 0, B: 0, C: 0, D: 0 })
const isLoading = ref(true)
let pollInterval: ReturnType<typeof setInterval> | null = null

// Listen to control messages for reset
useMqttTopic<ControlMessage>('control', (message) => {
  if (message.action === 'reset') {
    console.log('[LiveVote] Reset received, clearing votes')
    votes.value = { A: 0, B: 0, C: 0, D: 0 }
    // Reload from API in case there are any votes
    loadVotes()
  }
})

// Load votes from API
const loadVotes = async () => {
  try {
    const domain = import.meta.env.VITE_DOMAIN || 'warsawjs.keanuharrell.com'
    const response = await fetch(`https://${domain}/api/demo/vote`)
    if (response.ok) {
      const data = await response.json()
      votes.value = data.votes
    }
  } catch (error) {
    console.error('[LiveVote] Failed to load votes:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Load initial votes
  await loadVotes()

  // Poll every 2 seconds for updates
  pollInterval = setInterval(loadVotes, 2000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

const total = computed(() => {
  return Object.values(votes.value).reduce((a, b) => a + b, 0)
})

const percentage = (option: VoteOption) => {
  if (total.value === 0) return 0
  return Math.round((votes.value[option] / total.value) * 100)
}
</script>

<template>
  <div class="live-vote">
    <div class="header">
      <h3>🗳️ Live Poll Results</h3>
      <span class="status" :class="{ connected }">
        {{ connected ? '● Live' : '○ Connecting' }}
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
          <span class="count">({{ votes[option.id] }})</span>
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
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(40, 20, 60, 0.9));
  border-radius: 12px;
  padding: 2rem;
  color: white;
  border: 1px solid rgba(168, 85, 247, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(168, 85, 247, 0.3);
}

.header h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.status {
  font-size: 0.9rem;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  font-weight: 600;
  transition: all 0.3s ease;
}

.status.connected {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.question {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #e5e7eb;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.option:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.05);
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-id {
  font-weight: bold;
  font-size: 1.5rem;
  color: #a855f7;
  min-width: 2rem;
  text-align: center;
  padding: 0.25rem 0.5rem;
  background: rgba(168, 85, 247, 0.2);
  border-radius: 6px;
}

.option-text {
  font-size: 1.1rem;
  color: #e5e7eb;
  font-weight: 500;
}

.bar-container {
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.bar {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.percentage {
  font-weight: bold;
  color: #a855f7;
  font-size: 1.3rem;
}

.count {
  color: #9ca3af;
  font-size: 0.95rem;
}

.total {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(168, 85, 247, 0.2);
  color: #d1d5db;
  font-size: 1.1rem;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
