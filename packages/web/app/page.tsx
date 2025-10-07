import { RealtimeProvider } from '@/lib/realtime-provider'
import { DemoClient } from '@/components/demo-client'
import { MqttConfig, DemoStateDB, ChatMessageDB, VoteDB } from '@warsawjs/core';
import { Resource } from 'sst';
import { headers } from 'next/headers';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Force Next.js to treat this as dynamic by accessing headers
  await headers();

  // Server-side only: access SST Resources
  const realtimeConfig: MqttConfig = {
    endpoint: Resource.Realtime.endpoint,
    authorizerToken: Resource.RealtimeAuthorizerToken.value,
    authorizerName: Resource.Realtime.authorizer,
    appName: Resource.App.name,
    stage: Resource.App.stage,
  };

  // Load initial data from database
  const [initialState, initialMessages, initialVotes] = await Promise.all([
    DemoStateDB.get().catch(() => null),
    ChatMessageDB.list(100).catch(() => []),
    VoteDB.count().catch(() => ({ A: 0, B: 0, C: 0, D: 0 })),
  ]);

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
          <DemoClient
            initialMode={initialState?.mode}
            initialMessages={initialMessages}
            initialVotes={initialVotes}
          />
        </RealtimeProvider>
      </main>
    </div>
  )
}
