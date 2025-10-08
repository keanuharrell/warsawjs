<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMqttTopic, type ChatMessage } from '../composables/useMqtt'

interface ControlMessage {
  action: 'enable_chat' | 'enable_vote' | 'enable_email' | 'reset'
  timestamp: number
}

const props = defineProps<{
  maxMessages?: number
}>()

const { messages, connected, clearMessages } = useMqttTopic<ChatMessage>('chat')
const messagesContainer = ref<HTMLDivElement | null>(null)

// Listen to control messages for reset
useMqttTopic<ControlMessage>('control', (message) => {
  if (message.action === 'reset') {
    console.log('[LiveChat] Reset received, clearing messages')
    clearMessages()
  }
})

// Show only the last N messages
const displayMessages = computed(() => {
  const max = props.maxMessages || 10
  return messages.value.slice(-max)
})

// Auto-scroll to bottom when new messages arrive
watch(() => messages.value.length, () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value?.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }
})

const totalMessages = computed(() => messages.value.length)
</script>

<template>
  <div class="live-chat">
    <div class="info-panel">
      <div class="panel-content">
        <h3>💬 Live Chat</h3>
        <p class="description">
          Type your <strong>favorite tech stack</strong> in the chat!
        </p>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalMessages }}</div>
            <div class="stat-label">Messages</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon" :class="{ connected }">
              {{ connected ? '●' : '○' }}
            </div>
            <div class="stat-label">{{ connected ? 'Live' : 'Connecting' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="messages-panel">
      <div ref="messagesContainer" class="messages">
        <div
          v-for="(msg, idx) in displayMessages"
          :key="msg.id || idx"
          class="message"
        >
          <span class="username">{{ msg.username }}</span>
          <span class="text">{{ msg.text }}</span>
        </div>

        <div v-if="displayMessages.length === 0" class="empty">
          <div class="empty-icon">💬</div>
          <div>Waiting for messages...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-chat {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  min-height: 400px;
}

.info-panel {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.05));
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  border: 2px solid rgba(96, 165, 250, 0.3);
  display: flex;
  flex-direction: column;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-panel h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #e5e7eb;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #d1d5db;
  margin: 0;
}

.description strong {
  color: #60a5fa;
  font-weight: 700;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(96, 165, 250, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #60a5fa;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-icon {
  font-size: 2rem;
  color: #6b7280;
  line-height: 1;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.stat-icon.connected {
  color: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}

.stat-label {
  font-size: 0.85rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.messages-panel {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.9));
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 3px;
}

.message {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.05));
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #60a5fa;
  animation: slideIn 0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-weight: 700;
  color: #60a5fa;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text {
  color: #e5e7eb;
  font-size: 1rem;
  line-height: 1.5;
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin: auto;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
