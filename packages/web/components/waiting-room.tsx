'use client'

export function WaitingRoom() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="animate-pulse space-y-4">
        <h2 className="text-6xl font-bold">WarsawJS × SST</h2>
        <p className="text-2xl text-muted-foreground">
          Waiting for presentation to start...
        </p>
      </div>

      <div className="flex gap-2 mt-8">
        {[0, 150, 300].map((delay, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-8">Connected • Ready</p>
    </div>
  )
}
