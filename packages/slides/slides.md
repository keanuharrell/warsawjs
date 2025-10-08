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
🇫🇷🇺🇸 French-American · Based in Warsaw

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

<MqttStatus />

# Then I Discovered SST

<v-click>

<div class="text-xl mt-8">

📺 WebDevCody showed it on YouTube

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8">

For the first time, I thought:

</div>

</v-click>

<v-click>

<div class="text-3xl mt-4 text-green-400">

"I can actually **try** this."

</div>

</v-click>

<v-click>

<div class="text-lg mt-8 text-gray-400">

No YAML. No overwhelming setup. Just TypeScript I already knew.

</div>

</v-click>

<!--
The turning point
From paralysis to action
SST removed the barrier to entry
-->

<v-click>

<div class="text-2xl mt-8">

We're going to build an app that **you all**<br/>
will use **right now**...

</div>

</v-click>

<v-click>

<div class="text-3xl mt-8 text-green-400">

...and you'll see why SST changes everything.

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

<v-click>

<div class="text-xl mt-8">

Type your **favorite tech stack** in the chat!

</div>

</v-click>

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
const chat = new sst.aws.Realtime(
  "Chat",
  {
    handler: "chat.handler"
  }
);
```

<v-click>

<div class="mt-8 text-lg">

**3 lines of code.**

That's it.

</div>

</v-click>

::right::

<v-click>

<div class="ml-8">

## What SST Generated

- API Gateway WebSocket
- Lambda connect handler
- Lambda message handler
- Lambda disconnect handler
- DynamoDB connections table
- 17 IAM permissions
- CloudWatch log groups
- Auto-scaling config

<div class="mt-6 text-yellow-400 text-lg">

**Terraform:** 247 lines

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

<v-click>

<div class="text-2xl mt-8">

**What's the hardest part of AWS?**

</div>

</v-click>

<v-click>

<div class="grid grid-cols-2 gap-4 mt-8 text-left max-w-2xl mx-auto">
  <div class="bg-blue-500/20 p-4 rounded">A) IAM Permissions 🔐</div>
  <div class="bg-green-500/20 p-4 rounded">B) The Bill 💸</div>
  <div class="bg-yellow-500/20 p-4 rounded">C) Finding the Right Service 🔍</div>
  <div class="bg-red-500/20 p-4 rounded">D) All of the Above 😅</div>
</div>

</v-click>

<v-click>

<div class="mt-8 text-xl">

Vote now on your phone!

</div>

</v-click>

<!--
Admin panel: Click "Enable Vote"
Wait 15 seconds
Watch the results come in
-->

---
layout: center
---

# Live Results

<div class="max-w-4xl mx-auto">

<div class="text-center mb-8 text-2xl">
Results coming in real-time...
</div>

<!-- Placeholder for live results - will show via iframe or component -->
<div class="bg-gray-800 p-8 rounded-lg">
  <div class="space-y-4">
    <div class="text-lg opacity-75">
      Check your phones to see the live results!
    </div>
  </div>
</div>

</div>

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

<div class="mt-4 text-lg text-green-400">

Cost: **$0.0001** per vote

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

<div class="text-xl mt-8">

🎯 **Removed the fear** of breaking AWS

</div>

</v-click>

<v-click>

<div class="text-xl mt-4">

⚡ **Hot reload with real services** - saw changes instantly

</div>

</v-click>

<v-click>

<div class="text-xl mt-4">

✅ **Best practices built-in** - SST warns you before you mess up

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8 text-green-400">

From **watching tutorials** to **shipping apps** in weeks.

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
layout: center
class: text-center
---

# 📊 The Cost

<v-click>

<div class="text-6xl mt-12 text-green-400 font-bold">

$0.08

</div>

</v-click>

<v-click>

<div class="mt-8 text-2xl opacity-75">

For everything you just saw

</div>

</v-click>

<v-click>

<div class="mt-12">

| Service | Cost |
|---------|------|
| Lambda invocations | $0.0006 |
| DynamoDB operations | $0.0013 |
| WebSocket connections | $0.0003 |
| IoT messages | $0.03 |
| CloudFront transfer | $0.048 |
| **Total** | **$0.08** |

</div>

</v-click>

<!--
Shock value
Serverless pricing advantage
-->

---
layout: two-cols
---

# What You Actually Built

<div class="space-y-4 mt-4">

✅ Real-time chat<br/>
✅ Live voting system<br/>
✅ WebSocket API<br/>
✅ Database with aggregation<br/>
✅ Global CDN<br/>
✅ Auto-scaling infrastructure<br/>
✅ Monitoring & logging<br/>
✅ SSL certificates

</div>

::right::

<v-click>

<div class="ml-8">

## Time Comparison

**With Terraform:**
- 📝 400+ lines of config
- ⏱️ 2 days of work
- 🐛 Probably buggy
- 😰 Stressful debugging

**With SST:**
- 📝 12 lines of code
- ⏱️ 10 minutes
- ✅ Production-ready
- 😌 Actually enjoyable

</div>

</v-click>

<!--
Recap what was accomplished
Emphasize the difference
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
layout: center
class: text-center
---

# Questions? 🙋

<div class="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-left">

<div>

**Docs**
docs.sst.dev

</div>

<div>

**Discord**
sst.dev/discord

</div>

<div>

**Twitter**
@SST_dev

</div>

</div>

<!--
Open for Q&A
Have answers ready for common questions
-->

---
layout: statement
---

# Why I'm Sharing This

<v-click>

<div class="text-xl mt-8">

A year ago, I was **too scared** to deploy anything to AWS.

</div>

</v-click>

<v-click>

<div class="text-xl mt-4">

Today, I've shipped **real apps** with real users.

</div>

</v-click>

<v-click>

<div class="text-2xl mt-8">

SST didn't just teach me serverless...

</div>

</v-click>

<v-click>

<div class="text-3xl mt-4 text-green-400">

It gave me **confidence** to build.

</div>

</v-click>

<v-click>

<div class="text-lg mt-12 text-gray-400">

That's why I'm here. Not to sell you a tool,<br/>
but to share what unlocked **my** potential.

</div>

</v-click>

<!--
Authentic conclusion
Why you're really presenting
The human impact, not the technical
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
