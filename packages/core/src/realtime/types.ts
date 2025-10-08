// Topic types
export type TopicType = 'chat' | 'vote' | 'control'

// Message types
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

export interface ControlMessage {
  action: 'enable_chat' | 'enable_vote' | 'enable_email' | 'reset'
  timestamp: number
}

// Generic message wrapper
export interface RealtimeMessage<T = unknown> {
  type: TopicType
  data: T
}

// Connection state
export interface ConnectionState {
  connected: boolean
  error?: string
}

// Topic configuration
export interface TopicConfig {
  name: string
  qos?: 0 | 1 | 2
}

// Vote results
export interface VoteResults {
  A: number
  B: number
  C: number
  D: number
}
