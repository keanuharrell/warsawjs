import { ref, onMounted, onUnmounted } from 'vue'
import mqtt from 'mqtt'

export interface ChatMessage {
  id: string
  text: string
  username: string
  timestamp: number
}

export interface VoteMessage {
  option: 'A' | 'B' | 'C' | 'D'
  userId: string
  timestamp: number
}

export function useMqttTopic<T>(topic: string) {
  const messages = ref<T[]>([])
  const connected = ref(false)
  let client: mqtt.MqttClient | null = null

  onMounted(() => {
    const endpoint = import.meta.env.PUBLIC_REALTIME_ENDPOINT
    const token = import.meta.env.PUBLIC_REALTIME_TOKEN
    const authorizerName = import.meta.env.PUBLIC_REALTIME_AUTHORIZER
    const appName = import.meta.env.PUBLIC_APP_NAME || 'warsawjs'
    const stage = import.meta.env.PUBLIC_STAGE || 'dev'

    if (!endpoint || !token) {
      console.error('[MQTT] Missing configuration')
      return
    }

    const topicPath = `${appName}/${stage}/${topic}`

    client = mqtt.connect(endpoint, {
      protocolVersion: 5,
      username: `${authorizerName}?token=${token}`,
    })

    client.on('connect', () => {
      console.log(`[MQTT] Connected to ${topicPath}`)
      connected.value = true
      client?.subscribe(topicPath, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error:`, err)
        } else {
          console.log(`[MQTT] Subscribed to ${topicPath}`)
        }
      })
    })

    client.on('message', (_topic, payload) => {
      try {
        const message = JSON.parse(payload.toString()) as T
        messages.value.push(message)
      } catch (err) {
        console.error('[MQTT] Parse error:', err)
      }
    })

    client.on('error', (err) => {
      console.error('[MQTT] Connection error:', err)
      connected.value = false
    })

    client.on('close', () => {
      console.log('[MQTT] Disconnected')
      connected.value = false
    })
  })

  onUnmounted(() => {
    if (client) {
      client.end()
    }
  })

  return { messages, connected }
}
