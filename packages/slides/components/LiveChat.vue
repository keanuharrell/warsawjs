<script setup lang="ts">
import { computed } from 'vue'
import { useMqttTopic, type ChatMessage } from '../composables/useMqtt'

const props = defineProps<{
  maxMessages?: number
}>()

const { messages, connected } = useMqttTopic<ChatMessage>('chat')

// Show only the last N messages
const displayMessages = computed(() => {
  const max = props.maxMessages || 10
  return messages.value.slice(-max)
})
</script>

<template>
  <div class="live-chat">
    <div class="header">
      <h3>💬 Live Chat</h3>
      <span class="status" :class="{ connected }">
        {{ connected ? '● Live' : '○ Offline' }}
      </span>
    </div>

    <div class="messages">
      <div
        v-for="(msg, idx) in displayMessages"
        :key="msg.id || idx"
        class="message"
      >
        <span class="username">{{ msg.username }}:</span>
        <span class="text">{{ msg.text }}</span>
      </div>

      <div v-if="displayMessages.length === 0" class="empty">
        Waiting for messages...
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-chat {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.status {
  font-size: 0.9rem;
  color: #666;
}

.status.connected {
  color: #4ade80;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  animation: slideIn 0.3s ease;
}

.username {
  font-weight: bold;
  color: #60a5fa;
  margin-right: 0.5rem;
}

.text {
  color: #e5e7eb;
}

.empty {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
