# 🎤 WarsawJS Real-Time Demo

> **Live interactive presentation platform** showcasing real-time features with SST, Next.js, and AWS IoT Core.

Built for the **WarsawJS 2025** presentation: *"From AWS Overwhelm to SST Confidence"*

---

## ✨ What is this?

This is a **complete real-time web application** that allows:

- 💬 **Live Chat** - Audience members can chat in real-time during the presentation
- 🗳️ **Live Polls** - Interactive voting with instant results visualization
- 🎛️ **Admin Dashboard** - Control the presentation flow and enable/disable features
- 📊 **Live Slides** - Slidev presentation with real-time data integration

All of this is powered by **SST (Serverless Stack)** and deployed to AWS with just one command!

---

## 🚀 Why This Demo?

This project demonstrates how **SST makes AWS accessible** by:

1. **Type-safe Infrastructure as Code** - Define your AWS resources in TypeScript
2. **Instant Local Development** - Work with real AWS services locally with `sst dev`
3. **Built-in Real-time** - MQTT over WebSocket via AWS IoT Core, zero config
4. **Monorepo Support** - Share code between frontend, backend, and infrastructure
5. **Production Ready** - Deploy to multiple stages with one command

### Before SST 😰
```yaml
# Complex CloudFormation YAML
Resources:
  MyIoTPolicy:
    Type: AWS::IoT::Policy
    Properties:
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action: iot:Connect
            Resource: !Sub arn:aws:iot:${AWS::Region}:${AWS::AccountId}:*
```

### With SST 🎉
```typescript
// Simple, typed, and powerful
const realtime = new sst.aws.Realtime("Chat", {
  handler: "chat.handler"
});
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                            │
│                                                               │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │  Next.js    │◄────►│  AWS IoT     │◄────►│  Lambda    │ │
│  │  Web App    │ MQTT │  Core        │ Auth │  Functions │ │
│  └─────────────┘      └──────────────┘      └────────────┘ │
│                                                               │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │  Admin      │◄────►│  DynamoDB    │      │ Amazon SES │ │
│  │  Dashboard  │      │  Tables      │      │  Email     │ │
│  └─────────────┘      └──────────────┘      └────────────┘ │
│                                                               │
│  ┌─────────────┐                                             │
│  │  Slidev     │                                             │
│  │  Slides     │ (Static Site on S3 + CloudFront)           │
│  └─────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

### 📦 Project Structure

```
warsawjs/
├── packages/
│   ├── core/              # 🎯 Shared business logic
│   │   ├── realtime/      #    MQTT client & types
│   │   ├── auth/          #    Authentication
│   │   ├── email/         #    Email service
│   │   └── dynamo/        #    Database entities
│   │
│   ├── functions/         # ⚡ Lambda functions
│   │   └── src/
│   │       ├── api/       #    REST API handlers
│   │       ├── auth/      #    Auth callbacks
│   │       └── realtime/  #    MQTT authorizer
│   │
│   ├── web/               # 🌐 Public web app (Next.js)
│   ├── admin/             # 🎛️ Admin dashboard (Next.js)
│   └── slides/            # 📊 Presentation slides (Slidev)
│
├── infra/                 # ☁️ Infrastructure definitions
│   ├── realtime.ts        #    AWS IoT Core setup
│   ├── database.ts        #    DynamoDB tables
│   ├── auth.ts            #    OpenAuth config
│   └── ...
│
└── sst.config.ts          # 🔧 SST configuration
```

---

## 🎯 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **AWS Account** with credentials configured ([guide](https://docs.sst.dev/setting-up-aws))
- **SST CLI** (installed automatically with npm)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/keanuharrell/warsawjs.git
cd warsawjs

# 2. Install dependencies (using Bun - fast!)
bun install

# 3. Set required secrets
npx sst secret set RealtimeWriteToken "your-write-token-here"
npx sst secret set RealtimeReadOnlyToken "your-readonly-token-here"

# 4. Start development (this will deploy to AWS!)
npx sst dev
```

**That's it!** 🎉 Your app is now running with:
- ✅ Real AWS services (DynamoDB, IoT Core, Lambda)
- ✅ Live reload for instant feedback
- ✅ Local function invocation
- ✅ Real-time infrastructure updates

### Access Your Apps

Once `sst dev` is running:

- 🌐 **Web App**: http://localhost:3000
- 🎛️ **Admin Dashboard**: http://localhost:3001
- 📊 **Slides**: http://localhost:3030 (run `cd packages/slides && bun dev`)

---

## 🎮 Features Walkthrough

### 1. Live Chat 💬

Real-time messaging between all connected participants.

**How it works:**
- Users type messages in the web app
- Messages are published to MQTT topic `warsawjs/{stage}/chat`
- All connected clients (including slides) receive updates instantly
- Messages are stored in DynamoDB for persistence

```typescript
// It's this simple!
const { messages, publish } = useRealtimeTopic<ChatMessage>('chat')

// Publish a message
publish({ id: '1', text: 'Hello!', username: 'John', timestamp: Date.now() })
```

### 2. Live Voting 🗳️

Interactive polls with real-time results.

**How it works:**
- Users vote by clicking an option (A, B, C, or D)
- Votes are stored in DynamoDB (upsert by userId)
- Real-time updates via MQTT show live percentages
- Slides display results in a beautiful 2x2 grid

**Features:**
- ✅ One vote per user (stored in localStorage)
- ✅ Vote persistence across page refreshes
- ✅ Winner card highlighted with 👑
- ✅ Smooth animations and progress bars

### 3. Admin Control Panel 🎛️

Control the entire presentation flow.

**Features:**
- 📡 Enable/disable chat and voting
- 🔄 Reset all demo data
- 📊 View real-time connection status
- ✉️ Send email summaries

**Admin Flow:**
```
1. Open admin dashboard
2. Authenticate (OpenAuth)
3. Enable Chat → Participants can now chat
4. Enable Vote → Poll appears on all devices
5. Reset → Clean slate for next demo
```

### 4. Live Slides 📊

Slidev presentation with embedded real-time components.

**Cool Features:**
- Live chat messages appear during Demo #1
- Live vote results displayed during Demo #2
- QR code for easy audience participation
- Connection status indicator

---

## 🛠️ Technology Stack

| Category | Technology | Why? |
|----------|-----------|------|
| **Framework** | [SST](https://sst.dev) | Type-safe IaC, instant local dev |
| **Frontend** | [Next.js 15](https://nextjs.org) | React framework with App Router |
| **Slides** | [Slidev](https://sli.dev) | Markdown-based slides with Vue |
| **Real-time** | [AWS IoT Core](https://aws.amazon.com/iot-core/) | Managed MQTT broker |
| **Database** | [DynamoDB](https://aws.amazon.com/dynamodb/) | Serverless NoSQL database |
| **Auth** | [OpenAuth](https://github.com/openauthjs/openauth) | Modern auth for serverless |
| **Email** | [Resend](https://resend.com) | Developer-friendly email API |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | Beautiful, accessible components |
| **ORM** | [ElectroDB](https://electrodb.dev) | DynamoDB made easy |

---

## 📚 Learn More

### Key Concepts

#### 🔌 Real-time with MQTT

This project uses **AWS IoT Core** for real-time communication via MQTT over WebSocket.

**Topics Structure:**
```
{app}/{stage}/{feature}

Examples:
- warsawjs/dev/chat       (development chat)
- warsawjs/prod/vote      (production voting)
- warsawjs/dev/control    (admin control)
```

**Authorization:**
- JWT tokens for admin users (full access)
- Static write token for participants (chat + vote)
- Static read-only token for slides (subscribe only)

#### 🔐 Security

The `realtime/authorizer.ts` Lambda function validates tokens and returns fine-grained permissions:

```typescript
// Admin (JWT) → Full access
{ publish: ["warsawjs/dev/*"], subscribe: ["warsawjs/dev/*"] }

// Write token → Can chat and vote
{ publish: ["warsawjs/dev/chat", "warsawjs/dev/vote"], subscribe: ["warsawjs/dev/*"] }

// Read-only token → Slides can only subscribe
{ publish: ["warsawjs/dev/_readonly_dummy"], subscribe: ["warsawjs/dev/*"] }
```

#### 📦 Monorepo Architecture

The **core** package is the heart of the application:
- Shared types and business logic
- Framework-agnostic MQTT client
- Reusable across web, admin, functions, and slides

This ensures:
- ✅ Type safety across packages
- ✅ Single source of truth
- ✅ Easy refactoring and updates

---

## 🚢 Deployment

### Deploy to Staging

```bash
npx sst deploy --stage staging
```

### Deploy to Production

```bash
npx sst deploy --stage production
```

### Custom Domain Setup

Update `infra/dns.ts` with your domain:

```typescript
export const domain = "yourdomain.com"
```

SST will automatically:
- Create CloudFront distributions
- Set up SSL certificates
- Configure DNS records (via Cloudflare)

---

## 🧪 Development Tips

### Adding a New Real-time Feature

1. **Define types** in `packages/core/src/realtime/types.ts`:
   ```typescript
   export interface MyFeatureMessage {
     id: string
     data: string
     timestamp: number
   }
   ```

2. **Add topic** to `TopicType` union:
   ```typescript
   export type TopicType = 'chat' | 'vote' | 'control' | 'my-feature'
   ```

3. **Use in React** with the hook:
   ```typescript
   const { messages, publish } = useRealtimeTopic<MyFeatureMessage>('my-feature')
   ```

4. **Update authorizer** permissions if needed in `functions/src/realtime/authorizer.ts`

### Debugging

**MQTT Connection Issues:**
- Check browser console for `[MQTT]` logs
- Verify tokens are set: `npx sst secret list`
- Test topic format: `{app}/{stage}/{feature}`

**Lambda Functions:**
- View logs: `npx sst logs`
- Tail specific function: `npx sst logs --stage dev --function RealtimeAuthorizer`

**Infrastructure:**
- View resources: `npx sst console`
- Check CloudFormation: AWS Console → CloudFormation

---

## 🤝 Contributing

This project was created for a **WarsawJS presentation**, but feel free to:

- ⭐ Star the repo if you found it helpful
- 🐛 Report issues or bugs
- 💡 Suggest improvements
- 🔀 Fork and build your own version

---

## 📄 License

MIT License - feel free to use this code for your own projects!

---

## 👨‍💻 Author

**Keanu Harrell**

- 🌐 Website: [keanuharrell.com](https://keanuharrell.com)
- 🐙 GitHub: [@keanuharrell](https://github.com/keanuharrell)
- 📧 Email: keanuharrell@icloud.com

---

## 🙏 Acknowledgments

- **WarsawJS** community for the opportunity to present
- **SST team** for building an amazing framework
- **WebDevCody** for the YouTube video that introduced me to SST
- Everyone who contributed to the open-source libraries used in this project

---

## 🎬 Demo Video

> 🎥 *Coming soon! Link to the WarsawJS presentation recording*

---

<div align="center">

**Built with ❤️ using SST**

[Documentation](https://docs.sst.dev) · [Discord](https://sst.dev/discord) · [GitHub](https://github.com/sst/sst)

</div>
