'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { MqttConfig } from '@warsawjs/core/realtime'

const RealtimeConfigContext = createContext<MqttConfig | null>(null)

export function RealtimeProvider({
  children,
  config,
}: {
  children: ReactNode
  config: MqttConfig
}) {
  return (
    <RealtimeConfigContext.Provider value={config}>
      {children}
    </RealtimeConfigContext.Provider>
  )
}

export function useRealtimeConfig() {
  const config = useContext(RealtimeConfigContext)
  if (!config) {
    throw new Error('useRealtimeConfig must be used within RealtimeProvider')
  }
  return config
}
