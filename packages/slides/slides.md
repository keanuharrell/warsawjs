---
theme: default
background: https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072
title: SST - Serious Infrastructure Without Losing Your Sanity
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# SST
## Serious Infrastructure Without Losing Your Sanity

WarsawJS 2025 · Keanu Harrell

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/sst/sst" target="_blank" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:logo-github />
  </a>
</div>

<!--
Hello WarsawJS!
Today: Deploy a complete app on AWS without losing your mind
3 seconds of silence to create anticipation
-->

---
layout: center
class: text-center
---

# 👋 Quick Intro

<div class="mt-12">

<v-click>

## Keanu Harrell
📍 Based in Warsaw

</v-click>

<v-click>

<div class="mt-8 text-xl">

☁️ Cloud & Platform Engineer

</div>

</v-click>

<v-click>

<div class="mt-6 text-lg text-gray-400">

Kubernetes → Cloud → **Serverless** (the journey we'll talk about)

</div>

</v-click>

</div>

<!--
Ultra brief - 15 seconds max
Just establish who you are
The "why" comes later when we show the problem
-->

---
layout: statement
---

# My Problem

<v-click>

<div class="text-2xl mt-8">

I wanted to learn **cloud development**...

</div>

</v-click>

<v-click>

<div class="text-2xl mt-4">

...but every tutorial felt like reading **AWS documentation** 📚

</div>

</v-click>

<!--
Pause after each click
Let the audience relate to the frustration
-->

---
layout: statement
---

# Tutorial Hell

<v-click>

<div class="text-6xl mt-16">

📚 → 📺 → 📖

</div>

</v-click>

<v-click>

<div class="text-3xl mt-12 text-red-400">

Never **shipping**.

</div>

</v-click>

<!--
YOU SAY: "I spent months watching AWS tutorials, reading docs, but I was too scared to actually build anything. Sound familiar?"
SLIDE SHOWS: Just the visual
You tell the emotional story verbally
-->

---
layout: statement
---

# Then I Discovered SST

<v-click>

<div class="flex items-center justify-center gap-8 mt-12">

<div class="text-3xl">
📺 <span class="font-bold">WebDevCody</span>
</div>

<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=9OgkEVh9MNA" alt="QR Code" class="w-48 h-48" />

</div>

</v-click>

<!--
Pause after "we do better"
Build anticipation
-->

---
transition: slide-up
---

# "Classic" AWS Architecture

```yaml {monaco}
# terraform/main.tf (excerpt from 400+ lines)
resource "aws_lambda_function" "api" {
  filename    = "lambda.zip"
  role        = aws_iam_role.lambda.arn
  handler     = "index.handler"
  runtime     = "nodejs20.x"
  # ... environment, vpc, layers
}

resource "aws_iam_role" "lambda" {
  name = "lambda-execution-role"
  # ... 40 more lines
}

resource "aws_api_gateway_rest_api" "api" {
  # ... 30 more lines
}

# ... 330+ more lines
```

<div v-click class="absolute bottom-8 right-8 text-red-500 text-xl">

⏱️ **2 days** · 🤯 **10 coffees** · 😭 **3 meltdowns**

</div>

<!--
This is the usual nightmare
Show the pain first
-->

---
layout: two-cols
---

# With SST

```typescript
// sst.config.ts
export default $config({
  app(input) {
    return {
      name: "warsawjs-demo",
      removal: "remove",
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb");
  },
});
```

<v-click>

<div class="mt-8 text-green-500 text-xl">

✅ **5 minutes**<br/>
✅ **Your sanity intact**

</div>

</v-click>

::right::

<v-click>

<div class="ml-8">

## What SST Generates

- ✅ Lambda Functions
- ✅ API Gateway
- ✅ CloudFront CDN
- ✅ S3 Buckets
- ✅ DynamoDB Tables
- ✅ IAM Roles & Policies
- ✅ CloudWatch Logs
- ✅ SSL Certificates

<div class="text-sm mt-4 opacity-75">

Everything, automatically.

</div>

</div>

</v-click>

<!--
Show the contrast
Simple vs Complex
-->

---
layout: center
class: text-center
---

# Let's Prove It

<v-click>

<div class="text-xl mt-8">

Open your phone right now 📱

</div>

</v-click>

<v-click>

<QRCode />

## warsawjs.keanuharrell.com

</v-click>

<!--
Wait for people to join - 30 seconds
"I see people connecting... great!"
-->

---
layout: center
class: text-center
---

# 🎮 Demo #1
## Real-Time Chat

<LiveChat :maxMessages="8" />

<!--
On admin panel: Click "Enable Chat"
Wait 20 seconds for messages
Read a few out loud: "React... Vue... jQuery?! 😄"
-->

---
layout: two-cols
---

# The Chat You Just Used

```typescript
import { auth } from "./auth";
import { realtimeReadOnlyToken, realtimeWriteToken } from "./secrets";

export const realtime = new sst.aws.Realtime("Realtime", {
  authorizer: {
    handler: "authorizer.handler",
  },
})
```

::right::

<v-click>

<div class="ml-8">

## What SST Generated

- AWS IoT Core (MQTT broker)
- Lambda authorizer function
- IoT Core topic rules
- IAM roles & permissions
- CloudWatch log groups
- Auto-scaling policies
- Security policies
- Connection management

<div class="mt-6 text-yellow-400 text-lg">

**All configured automatically**

</div>

</div>

</v-click>

<!--
Emphasize the difference
SST did the expert work for you
-->

---
layout: center
class: text-center
---

# 🗳️ Demo #2
## Interactive Vote

<LiveVote />

<v-click>

<div class="mt-8 text-xl">

Vote now on your phone!

</div>

</v-click>

<!--
Point to the screen
"Look at option D climbing..."
"You all know the pain!"
Wait until voting stabilizes
-->

---
layout: two-cols
---

# The Vote System

```typescript
// Vote handler
export const handler = async (event) => {
  const vote = JSON.parse(event.body);

  // Save to DynamoDB
  await db.votes.create({
    id: ulid(),
    option: vote.option,
    timestamp: Date.now()
  });

  // Broadcast update
  await iot.publish({
    topic: "votes/results",
    payload: results
  });
};
```

::right::

<v-click>

<div class="ml-8">

## What Just Happened

✅ **Real-time** aggregation<br/>
✅ **Zero errors**<br/>
✅ **Auto-scaled**<br/>
✅ **Type-safe** everywhere

<div class="mt-8 bg-gray-800 p-4 rounded">

**Infrastructure:**
- DynamoDB for storage
- IoT for real-time
- Lambda for logic
- CloudFront for delivery

</div>

</div>

</v-click>

<!--
Emphasize the real-time aspect
Zero configuration for scaling
-->

---
layout: statement
---

# What SST Did For Me

<v-click>

<div class="text-2xl mt-8">

🎯 **No more fear**

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8">

⚡ **Instant feedback**

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8">

✅ **Built-in guardrails**

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8 text-green-400">

🚀 **Tutorials → Production**

</div>

</v-click>

<!--
Personal story - what actually changed for you
Not marketing bullets, real impact
The dev experience improvement that mattered
-->

---
layout: two-cols
---

# Local Development

```bash
sst dev
```

<v-click>

<div class="mt-8">

**What happens:**

✅ Hot reload in **0.3s**<br/>
✅ Same as production<br/>
✅ Real-time logs<br/>
✅ No redeploy needed

</div>

</v-click>

::right::

<v-click>

<div class="ml-8">

## Live Demo

Change code → Save

```typescript
export const handler = async () => {
  return {
    statusCode: 200,
    body: "Hello Warsaw!" // ← Edit
  };
};
```

<div class="mt-4 text-green-400 font-mono text-sm">

```
[sst] Reloaded in 0.3s ⚡
```

</div>

<div class="mt-8 text-xl">

**Terraform:** Redeploy = 5 min<br/>
**SST:** Hot reload = 0.3s 🔥

</div>

</div>

</v-click>

<!--
Show the killer feature
DX that matters
-->

---
layout: statement
---

# Why I'm Sharing This

<v-click>

<div class="text-2xl mt-8">

😰 **Too scared → Shipping**

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8">

📚 **Learning → Building**

</div>

</v-click>

<v-click>

<div class="text-3xl mt-8 text-green-400">

💪 **Found confidence**

</div>

</v-click>

<v-click>

<div class="text-xl mt-12 text-gray-400">

Sharing what unlocked my potential

</div>

</v-click>

<!--
Authentic conclusion
Why you're really presenting
The human impact, not the technical
-->

---
layout: center
class: text-center
---

# 🎯 Try It Yourself

<div class="grid grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">

<div class="bg-gray-800 p-6 rounded-lg">

### Get Started

```bash
npx create-sst@latest
```

[docs.sst.dev](https://docs.sst.dev)

</div>

<div class="bg-gray-800 p-6 rounded-lg">

### This Demo

<QRCode url="https://github.com/keanuharrell/warsawjs" :size="128" />

github.com/keanuharrell/warsawjs

</div>

</div>

<v-click>

<div class="mt-12 text-xl">

⭐ Star [sst/sst](https://github.com/sst/sst) on GitHub<br/>
🐦 Tweet **#WarsawJS** **#SST**

</div>

</v-click>

<!--
Clear call to action
Make it easy to follow up
-->

---
layout: end
class: text-center
---

# Dziękuję! 🇵🇱

**Keanu Harrell**

[keanuharrell.com](https://keanuharrell.com) · [@keanuharrell](https://twitter.com/keanuharrell)

<div class="mt-8 opacity-75">

Built with [SST](https://sst.dev) · Slides with [Slidev](https://sli.dev)

</div>

<PoweredBySlidev mt-10 />
