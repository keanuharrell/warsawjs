<script setup lang="ts">
import { useMqttTopic } from '../composables/useMqtt'

// Just connect to control topic to test connection
const { connected } = useMqttTopic('control')
</script>

<template>
  <div class="mqtt-status" :class="{ connected }">
    <span class="indicator">●</span>
    <span class="label">{{ connected ? 'Connected' : 'Connecting...' }}</span>
  </div>
</template>

<style scoped>
.mqtt-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 16px;
  border-radius: 20px;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.mqtt-status.connected {
  color: #4ade80;
  border-color: #4ade80;
}

.indicator {
  font-size: 1.2rem;
  animation: pulse 2s ease-in-out infinite;
}

.mqtt-status.connected .indicator {
  color: #4ade80;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
