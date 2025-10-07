'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function EmailDemo() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/demo/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send email')
      }

      setStatus('success')
      setShowConfetti(true)
      setEmail('')

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email')
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Main Thank You Message */}
      <div className="mb-12">
        <div className="text-8xl mb-6 animate-bounce">🙏</div>
        <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
        <p className="text-2xl text-muted-foreground mb-6">
          Thanks for joining this WarsawJS × SST presentation
        </p>
        <div className="flex justify-center gap-4 text-lg">
          <span>🇵🇱 Warsaw</span>
          <span>•</span>
          <span>⚡ SST</span>
          <span>•</span>
          <span>🚀 Serverless</span>
        </div>
      </div>

      {/* Email Section */}
      <Card className="p-8 relative overflow-hidden">
        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}

        {status === 'success' ? (
          <div className="py-8 relative z-10">
            <div className="success-checkmark mb-4">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Check your inbox!</h3>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent you a detailed recap with resources and next steps.
            </p>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Send to another email
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Want to learn more?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a detailed recap with links, resources, and next steps sent to your inbox (optional)
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="text-lg py-6"
              />

              {status === 'error' && (
                <p className="text-sm text-red-600 animate-shake">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 relative"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="email-fly">📧</span>
                    Sending...
                  </span>
                ) : (
                  'Send me the recap 📧'
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                No spam, just useful resources. Promise! 🤝
              </p>
            </form>
          </>
        )}
      </Card>

      <style jsx>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 2s ease-out forwards;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .email-fly {
          display: inline-block;
          animation: fly 0.8s ease-in-out infinite;
        }

        @keyframes fly {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-5deg); }
          75% { transform: translateY(-8px) rotate(5deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .success-checkmark {
          width: 80px;
          height: 115px;
          margin: 0 auto;
        }

        .check-icon {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 4px solid #10b981;
        }

        .icon-line {
          height: 5px;
          background-color: #10b981;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }

        .icon-line.line-tip {
          top: 46px;
          left: 14px;
          width: 25px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }

        .icon-line.line-long {
          top: 38px;
          right: 8px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }

        .icon-circle {
          top: -4px;
          left: -4px;
          z-index: 10;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          border: 4px solid rgba(16, 185, 129, 0.3);
        }

        .icon-fix {
          top: 8px;
          width: 5px;
          left: 26px;
          z-index: 1;
          height: 85px;
          position: absolute;
          transform: rotate(-45deg);
          background-color: hsl(var(--card));
        }

        @keyframes icon-line-tip {
          0% {
            width: 0;
            left: 1px;
            top: 19px;
          }
          54% {
            width: 0;
            left: 1px;
            top: 19px;
          }
          70% {
            width: 50px;
            left: -8px;
            top: 37px;
          }
          84% {
            width: 17px;
            left: 21px;
            top: 48px;
          }
          100% {
            width: 25px;
            left: 14px;
            top: 45px;
          }
        }

        @keyframes icon-line-long {
          0% {
            width: 0;
            right: 46px;
            top: 54px;
          }
          65% {
            width: 0;
            right: 46px;
            top: 54px;
          }
          84% {
            width: 55px;
            right: 0px;
            top: 35px;
          }
          100% {
            width: 47px;
            right: 8px;
            top: 38px;
          }
        }
      `}</style>

      {/* Footer */}
      <div className="mt-12 text-muted-foreground">
        <p className="mb-2">Built with SST, Next.js, AWS IoT, DynamoDB, and SES</p>
        <p className="text-sm">Keanu Harrell • WarsawJS 2025</p>
      </div>
    </div>
  )
}
