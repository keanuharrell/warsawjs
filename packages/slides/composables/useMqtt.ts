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
    const endpoint = import.meta.env.VITE_IOT_ENDPOINT
    const token = import.meta.env.VITE_IOT_TOKEN
    const authorizerName = import.meta.env.VITE_IOT_AUTHORIZER
    const appName = import.meta.env.VITE_APP_NAME
    const stage = import.meta.env.VITE_STAGE

    console.log('[MQTT] Environment check:', {
      endpoint,
      token: token ? `${token.substring(0, 10)}...` : 'missing',
      authorizerName,
      allEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
    })

    if (!endpoint || !token || !authorizerName) {
      console.error('[MQTT] Missing configuration', { endpoint, token: token ? 'present' : 'missing', authorizerName })
      return
    }

    const topicPath = `${appName}/${stage}/${topic}`
    const url = `wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizerName}`
    const clientId = `slides_${Math.random().toString(36).substring(2, 15)}`

    console.log('[MQTT] Connecting with', { url, topicPath, clientId, protocolVersion: 5 })

    client = mqtt.connect(url, {
      protocolVersion: 5,
      username: '',
      password: token,
      clientId,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
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
