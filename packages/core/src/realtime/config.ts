import type { TopicType } from './types'

// Topic prefix based on app/stage
export const getTopicPrefix = (appName: string, stage: string) => {
  return `${appName}/${stage}`
}

// Get full topic name
export const getTopic = (type: TopicType, appName: string, stage: string): string => {
  const prefix = getTopicPrefix(appName, stage)
  return `${prefix}/${type}`
}

// MQTT configuration interface
export interface MqttConfig {
  endpoint: string
  authorizerToken: string
  appName: string
  stage: string
}
