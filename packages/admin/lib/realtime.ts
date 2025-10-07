'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mqtt from 'mqtt'
import {
  RealtimeClient,
  type TopicType,
  getTopic
} from '@warsawjs/core/realtime'
import { useRealtimeConfig } from './realtime-provider'

// Create MQTT client singleton per config
const realtimeClients = new Map<string, RealtimeClient>()

const getRealtimeClient = (config: ReturnType<typeof useRealtimeConfig>) => {
  const key = `${config.appName}-${config.stage}`

  if (!realtimeClients.has(key)) {
    realtimeClients.set(key, new RealtimeClient(config, mqtt.connect))
  }
  return realtimeClients.get(key)!
}

// Hook for connection management
export const useRealtimeConnection = () => {
  const config = useRealtimeConfig()
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string>()
  const clientRef = useRef<RealtimeClient>()

  useEffect(() => {
    const client = getRealtimeClient(config)
    clientRef.current = client

    client.connect()
      .then(() => setConnected(true))
      .catch((err) => {
        setError(err.message)
        setConnected(false)
      })

    return () => {
      // Don't disconnect on unmount - keep connection alive for other components
    }
  }, [config])

  return { connected, error, client: clientRef.current }
}

// Hook for subscribing to a topic
export const useRealtimeTopic = <T = unknown>(
  topicType: TopicType,
  onMessage?: (data: T) => void
) => {
  const config = useRealtimeConfig()
  const [messages, setMessages] = useState<T[]>([])
  const { connected } = useRealtimeConnection()
  const callbackRef = useRef(onMessage)

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!connected) return

    const client = getRealtimeClient(config)
    const topic = getTopic(topicType, config.appName, config.stage)

    const handleMessage = (message: string) => {
      try {
        const data = JSON.parse(message) as T
        setMessages(prev => [...prev, data])
        callbackRef.current?.(data)
      } catch (err) {
        console.error('[useRealtimeTopic] Failed to parse message:', err)
      }
    }

    client.subscribe(topic, handleMessage).catch((err) => {
      console.error(`[useRealtimeTopic] Failed to subscribe to ${topic}:`, err)
    })

    return () => {
      client.unsubscribe(topic, handleMessage).catch((err) => {
        console.error(`[useRealtimeTopic] Failed to unsubscribe from ${topic}:`, err)
      })
    }
  }, [connected, topicType])

  const publish = useCallback(async (data: T) => {
    const client = getRealtimeClient(config)
    const topic = getTopic(topicType, config.appName, config.stage)

    console.log(`[useRealtimeTopic] Publishing to ${topic}:`, data)

    try {
      await client.publish(topic, JSON.stringify(data))
      console.log(`[useRealtimeTopic] Successfully published to ${topic}`)
    } catch (err) {
      console.error(`[useRealtimeTopic] Failed to publish to ${topic}:`, err)
      throw err
    }
  }, [topicType, config])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    publish,
    clearMessages,
  }
}
