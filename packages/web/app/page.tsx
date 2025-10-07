import { RealtimeProvider } from '@/lib/realtime-provider'
import { DemoClient } from './components/demo-client'
import { MqttConfig } from '@warsawjs/core';
import { Resource } from 'sst';

export default async function Home() {
  // Server-side only: access SST Resources
  const realtimeConfig: MqttConfig = {
    endpoint: Resource.Realtime.endpoint,
    authorizerToken: Resource.RealtimeAuthorizerToken.value,
    authorizerName: Resource.Realtime.authorizer,
    appName: Resource.App.name,
    stage: Resource.App.stage,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">WarsawJS × SST Live Demo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Follow along with Keanu Harrell&apos;s WarsawJS talk!
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <RealtimeProvider config={realtimeConfig}>
          <DemoClient />
        </RealtimeProvider>
      </main>
    </div>
  )
}
