export type StepId = 'waiting' | 'chat' | 'vote' | 'email'

export interface DemoStepConfig {
  id: StepId
  label: string
  icon: string
  description: string
}

export const DEMO_STEPS: DemoStepConfig[] = [
  {
    id: 'waiting',
    label: 'Waiting Room',
    icon: '⏳',
    description: 'Show waiting screen',
  },
  {
    id: 'chat',
    label: 'Live Chat',
    icon: '💬',
    description: 'Enable real-time chat',
  },
  {
    id: 'vote',
    label: 'Live Poll',
    icon: '🗳️',
    description: 'Start the AWS difficulty poll',
  },
  {
    id: 'email',
    label: 'Thank You',
    icon: '🙏',
    description: 'Final thank you + optional email recap',
  },
]

export function getStepById(id: StepId): DemoStepConfig | undefined {
  return DEMO_STEPS.find(step => step.id === id)
}

export function getStepLabel(id: StepId): string {
  return getStepById(id)?.label ?? id
}
