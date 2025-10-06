import { DemoClient } from './components/demo-client'

export default async function Home() {
  // Server-side: Can access SST Resources, env vars, etc.
  // const config = {
  //   controlTopicEndpoint: Resource.Control?.endpoint || '',
  //   chatTopicEndpoint: Resource.Chat?.endpoint || '',
  // }

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
        <DemoClient />
      </main>
    </div>
  )
}
