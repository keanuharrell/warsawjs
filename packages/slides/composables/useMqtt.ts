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

// Singleton MQTT client
let sharedClient: mqtt.MqttClient | null = null
const connectionState = ref(false)

function getOrCreateClient() {
  if (sharedClient?.connected) {
    return sharedClient
  }

  const endpoint = import.meta.env.VITE_IOT_ENDPOINT
  const token = import.meta.env.VITE_IOT_TOKEN
  const authorizerName = import.meta.env.VITE_IOT_AUTHORIZER

  if (!endpoint || !token || !authorizerName) {
    console.error('[MQTT] Missing configuration')
    throw new Error('MQTT configuration missing')
  }

  const url = `wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizerName}`
  const clientId = `slides_${Math.random().toString(36).substring(2, 15)}`

  console.log('[MQTT] Creating shared client', { clientId })

  sharedClient = mqtt.connect(url, {
    protocolVersion: 5,
    username: '',
    password: token,
    clientId,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
  })

  sharedClient.on('connect', () => {
    console.log('[MQTT] Shared client connected')
    connectionState.value = true
  })

  sharedClient.on('error', (err) => {
    console.error('[MQTT] Connection error:', err)
    connectionState.value = false
  })

  sharedClient.on('close', () => {
    console.log('[MQTT] Disconnected')
    connectionState.value = false
  })

  return sharedClient
}

export function useMqttTopic<T>(topic: string, onMessage?: (data: T) => void) {
  const messages = ref<T[]>([])
  const connected = ref(connectionState.value)
  let client: mqtt.MqttClient | null = null

  onMounted(() => {
    const appName = import.meta.env.VITE_APP_NAME
    const stage = import.meta.env.VITE_STAGE
    const topicPath = `${appName}/${stage}/${topic}`

    try {
      client = getOrCreateClient()

      const handleMessage = (_topic: string, payload: Buffer) => {
        if (_topic === topicPath) {
          try {
            const message = JSON.parse(payload.toString()) as T
            // @ts-ignore - Vue ref typing issue with generics
            messages.value.push(message)
            onMessage?.(message)
          } catch (err) {
            console.error('[MQTT] Parse error:', err)
          }
        }
      }

      client.on('message', handleMessage)

      client.on('connect', () => {
        connected.value = true
        client?.subscribe(topicPath, (err) => {
          if (err) {
            console.error(`[MQTT] Subscribe error:`, err)
          } else {
            console.log(`[MQTT] Subscribed to ${topicPath}`)
          }
        })
      })

      // If already connected, subscribe immediately
      if (client.connected) {
        connected.value = true
        client.subscribe(topicPath, (err) => {
          if (err) {
            console.error(`[MQTT] Subscribe error:`, err)
          } else {
            console.log(`[MQTT] Subscribed to ${topicPath}`)
          }
        })
      }
    } catch (error) {
      console.error('[MQTT] Failed to setup topic:', error)
    }
  })

  onUnmounted(() => {
    // Don't close shared client on unmount
  })

  const clearMessages = () => {
    messages.value = []
  }

  return { messages, connected, clearMessages }
}
