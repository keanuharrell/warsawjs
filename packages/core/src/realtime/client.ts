import type { MqttConfig } from './config'

// MQTT Client interface (will be implemented by web/admin with actual mqtt library)
export interface IMqttClient {
  connected: boolean
  subscribe(topic: string, options: { qos: 0 | 1 | 2 }, callback: (error?: Error) => void): void
  unsubscribe(topic: string, callback: (error?: Error) => void): void
  publish(topic: string, message: string, options: { qos: 0 | 1 | 2 }, callback: (error?: Error) => void): void
  end(force: boolean, options: unknown, callback: () => void): void
  on(event: string, callback: (...args: any[]) => void): void
}

export type MqttClientFactory = (endpoint: string, options: any) => IMqttClient

export class RealtimeClient {
  private client: IMqttClient | null = null
  private connecting = false
  private callbacks = new Map<string, Set<(message: string) => void>>()
  private config: MqttConfig
  private mqttFactory: MqttClientFactory

  constructor(config: MqttConfig, mqttFactory: MqttClientFactory) {
    this.config = config
    this.mqttFactory = mqttFactory
  }

  async connect(): Promise<IMqttClient> {
    if (this.client?.connected) {
      return this.client
    }

    if (this.connecting) {
      // Wait for existing connection attempt
      return new Promise((resolve, reject) => {
        const checkConnection = setInterval(() => {
          if (this.client?.connected) {
            clearInterval(checkConnection)
            resolve(this.client)
          } else if (!this.connecting) {
            clearInterval(checkConnection)
            reject(new Error('Connection failed'))
          }
        }, 100)
      })
    }

    this.connecting = true

    if (!this.config.endpoint || !this.config.authorizerToken) {
      this.connecting = false
      throw new Error('Missing MQTT configuration')
    }

    return new Promise((resolve, reject) => {
      try {
        // Build the WebSocket URL with custom authorizer
        const url = `wss://${this.config.endpoint}/mqtt?x-amz-customauthorizer-name=${this.config.authorizerName}`

        console.log('[Realtime] Connecting to:', url)

        this.client = this.mqttFactory(url, {
          protocolVersion: 5,
          username: '', // Must be empty for custom authorizer
          password: this.config.authorizerToken,
          clientId: `client_${Math.random().toString(36).substring(2, 15)}`,
          reconnectPeriod: 5000,
          connectTimeout: 30000,
        })

        this.client.on('connect', () => {
          this.connecting = false
          console.log('[Realtime] Connected to MQTT broker')
          resolve(this.client!)
        })

        this.client.on('error', (error: Error) => {
          console.error('[Realtime] Connection error:', error)
          this.connecting = false
          reject(error)
        })

        this.client.on('message', (topic: string, payload: Buffer) => {
          const message = payload.toString()
          console.log('[Realtime] Received message on topic:', topic, message)
          const handlers = this.callbacks.get(topic)
          if (handlers) {
            handlers.forEach(handler => handler(message))
          }
        })

        this.client.on('reconnect', () => {
          console.log('[Realtime] Reconnecting...')
        })

        this.client.on('close', () => {
          console.log('[Realtime] Connection closed')
        })

        this.client.on('offline', () => {
          console.warn('[Realtime] Client is offline')
        })

        this.client.on('disconnect', (packet: any) => {
          console.warn('[Realtime] Disconnected:', packet)
        })

      } catch (error) {
        this.connecting = false
        reject(error)
      }
    })
  }

  async subscribe(
    topic: string,
    callback: (message: string) => void,
    qos: 0 | 1 | 2 = 0
  ): Promise<void> {
    const client = await this.connect()

    return new Promise((resolve, reject) => {
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.error(`[Realtime] Failed to subscribe to ${topic}:`, error)
          reject(error)
          return
        }

        console.log(`[Realtime] Subscribed to ${topic}`)

        if (!this.callbacks.has(topic)) {
          this.callbacks.set(topic, new Set())
        }
        this.callbacks.get(topic)!.add(callback)

        resolve()
      })
    })
  }

  async unsubscribe(topic: string, callback?: (message: string) => void): Promise<void> {
    if (!this.client?.connected) return

    if (callback) {
      const handlers = this.callbacks.get(topic)
      if (handlers) {
        handlers.delete(callback)
        if (handlers.size === 0) {
          this.callbacks.delete(topic)
        }
      }
    } else {
      this.callbacks.delete(topic)
    }

    // Only unsubscribe from MQTT if no more callbacks
    if (!this.callbacks.has(topic) || this.callbacks.get(topic)!.size === 0) {
      return new Promise((resolve, reject) => {
        this.client!.unsubscribe(topic, (error) => {
          if (error) {
            console.error(`[Realtime] Failed to unsubscribe from ${topic}:`, error)
            reject(error)
            return
          }
          console.log(`[Realtime] Unsubscribed from ${topic}`)
          resolve()
        })
      })
    }
  }

  async publish(topic: string, message: string, qos: 0 | 1 | 2 = 0): Promise<void> {
    const client = await this.connect()

    return new Promise((resolve, reject) => {
      client.publish(topic, message, { qos }, (error) => {
        if (error) {
          console.error(`[Realtime] Failed to publish to ${topic}:`, error)
          reject(error)
          return
        }
        console.log(`[Realtime] Published to ${topic}`)
        resolve()
      })
    })
  }

  async disconnect(): Promise<void> {
    if (!this.client) return

    return new Promise((resolve) => {
      this.client!.end(false, {}, () => {
        console.log('[Realtime] Disconnected')
        this.client = null
        this.callbacks.clear()
        resolve()
      })
    })
  }

  isConnected(): boolean {
    return this.client?.connected ?? false
  }
}
