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
  { id: 'A' as const, label: 'A', text: 'rm -rf node_modules', emoji: '💀', color: '#3b82f6' },
  { id: 'B' as const, label: 'B', text: 'Git merge conflicts', emoji: '🔥', color: '#10b981' },
  { id: 'C' as const, label: 'C', text: '"Works on my machine"', emoji: '🤷', color: '#f59e0b' },
  { id: 'D' as const, label: 'D', text: 'Production on Friday', emoji: '😱', color: '#ef4444' },
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
    loadVotes()
  }
})

// Load votes from API
const loadVotes = async () => {
  try {
    const domain = import.meta.env.VITE_DOMAIN
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
  await loadVotes()
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

const winner = computed(() => {
  if (total.value === 0) return null
  const maxVotes = Math.max(...Object.values(votes.value))
  return options.find(opt => votes.value[opt.id] === maxVotes)
})
</script>

<template>
  <div class="live-vote">
    <div class="vote-header">
      <div class="title-section">
        <h3>😰 What scares you the most?</h3>
        <div class="meta-stats">
          <span class="total-votes">{{ total }} votes</span>
          <span class="status" :class="{ connected }">
            {{ connected ? '● Live' : '○ Connecting' }}
          </span>
          <span v-if="winner && total > 0" class="winner-badge">
            👑 {{ winner.emoji }} Winner
          </span>
        </div>
      </div>
    </div>

    <div class="results-grid">
      <div
        v-for="option in options"
        :key="option.id"
        class="vote-card"
        :class="{ winner: winner?.id === option.id && total > 0 }"
      >
        <div class="card-content">
          <div class="card-header">
            <span class="option-emoji">{{ option.emoji }}</span>
            <span class="option-label">{{ option.label }}</span>
          </div>
          <div class="option-text">{{ option.text }}</div>
        </div>

        <div class="card-stats">
          <div class="percentage" :style="{ color: option.color }">
            {{ percentage(option.id) }}%
          </div>
          <div class="count">{{ votes[option.id] }}</div>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: `${percentage(option.id)}%`,
              backgroundColor: option.color,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-vote {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(30, 20, 50, 0.9));
  border-radius: 12px;
  padding: 1rem;
  color: white;
  border: 1px solid rgba(168, 85, 247, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 900px;
  margin: 0 auto;
}

.vote-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(168, 85, 247, 0.2);
}

.title-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e5e7eb;
}

.meta-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.total-votes {
  font-size: 0.85rem;
  color: #9ca3af;
  font-weight: 500;
}

.status {
  font-size: 0.8rem;
  color: #6b7280;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  font-weight: 600;
}

.status.connected {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.winner-badge {
  font-size: 0.8rem;
  color: #a855f7;
  padding: 0.15rem 0.6rem;
  border-radius: 8px;
  background: rgba(168, 85, 247, 0.2);
  font-weight: 600;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.vote-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 10px;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  min-height: 140px;
}

.vote-card.winner {
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05));
  transform: scale(1.03);
}

.vote-card.winner::before {
  content: '👑';
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  font-size: 0.9rem;
  animation: float 2s ease-in-out infinite;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}

.option-emoji {
  font-size: 1.8rem;
}

.option-label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #a855f7;
  padding: 0.2rem 0.5rem;
  background: rgba(168, 85, 247, 0.2);
  border-radius: 5px;
}

.option-text {
  font-size: 0.75rem;
  color: #d1d5db;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-bottom: 0.5rem;
}

.percentage {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.count {
  font-size: 0.7rem;
  color: #9ca3af;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: auto;
}

.progress-fill {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
