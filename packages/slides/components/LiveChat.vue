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
    <div class="header">
      <h3>💬 Live Chat</h3>
      <div class="header-info">
        <span class="count">{{ totalMessages }} messages</span>
        <span class="status" :class="{ connected }">
          {{ connected ? '● Live' : '○ Connecting' }}
        </span>
      </div>
    </div>

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
        <div class="empty-hint">Messages will appear here in real-time</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-chat {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.9));
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(96, 165, 250, 0.3);
}

.header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.count {
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
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
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

.empty-hint {
  font-size: 0.85rem;
  opacity: 0.6;
  font-style: italic;
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
