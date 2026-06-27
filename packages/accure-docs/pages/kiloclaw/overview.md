---
title: "AccureClaw"
description: "One-click deployment of your Accure-hosted AI agent with OpenClaw"
---

# AccureClaw 🦀

AccureClaw is Accure's hosted [OpenClaw](https://openclaw.ai) service — a one-click deployment that gives you a personal or organization-scoped AI agent without the complexity of self-hosting. OpenClaw is a 24/7, open source AI agent that connects to Accure Chat and optional chat platforms like Telegram, Discord, and Slack so it can take real actions automatically, not just chat.

AccureClaw is powered by Accure Code. The API key is platform-managed, so you never need to bring your own.

## Why AccureClaw?

- **No infrastructure setup** — Skip Docker, servers, and configuration files
- **Instant provisioning** — Your agent is ready in seconds
- **Accure Chat included** — Use the first-party Accure Chat channel without token setup
- **Powered by Accure Code** — API key is automatically generated and refreshed
- **Uses existing credits** — Runs on your Accure Gateway balance
- **Multiple free models** — Choose from several models at no additional cost
- **Web UI included** — Access your agent's web interface directly from the dashboard

## Prerequisites

- **Accure account** — Sign up at [accure.ai](https://accure.ai) if you haven't already
- **Model access** — AccureClaw uses **Accure Gateway by default**, which provides access to **500+ AI models** through a single integration.

Depending on your setup, you can also use:

- **Your own provider API keys (BYOK)** such as Anthropic, OpenAI, Google, or other supported providers.
- **Organization access** if your organization has AccureClaw enabled and you want the instance scoped to that organization.

## Creating an Instance

1. Navigate to your [Accure profile](https://app.accurecode.ai/profile)
2. Click **Claw** in the left navigation

{% image src="/docs/img/accureclaw/profile-claw-nav.png" alt="Profile page showing Claw navigation" width="400" caption="Claw navigation in profile sidebar" /%}

3. Click **Create Instance**
4. Your instance will use **Accure Auto Balanced** as the default model. You can optionally select a different model from the dropdown — see all available models at the [Accure Leaderboard](https://accure.ai/leaderboard#all-models).

{% image src="/docs/img/accureclaw/create-instance.png" alt="Create instance modal with model selection" width="600" caption="Model selection during instance creation" /%}

5. Optionally configure third-party chat channels (Telegram, Discord, Slack) — Accure Chat is already available, and you can add other channels later from [Settings](/docs/accureclaw/dashboard#settings)
6. Click **Create & Provision**

Your instance will be provisioned in seconds. Each instance runs on a dedicated machine with 2 shared vCPUs, 3 GB RAM, and a 10 GB persistent SSD. Once created in a region, your instance always runs there.

## Organization AccureClaw

If your organization has AccureClaw enabled, you can use an organization-scoped instance for work that belongs to that organization. The core AccureClaw experience is the same as a personal instance, with these differences:

- Organization instances are separated from your **Personal** instance in AccureClaw lists.
- Provisioning depends on your organization membership and the organization's AccureClaw entitlement.
- Instance ownership and routing are scoped to the organization, so use organization-approved accounts and credentials for connected services.

## Managing Your Instance

The AccureClaw dashboard gives you full control over your instance.

{% image src="/docs/img/accureclaw/instance-dashboard.png" alt="Instance dashboard with controls and status" width="800" caption="Instance management dashboard" /%}

### Controls

- **Start Machine** — Boot a stopped instance (up to 60 seconds)
- **Restart OpenClaw** — Quick restart of just the OpenClaw process; the machine stays up
- **Redeploy** — This will stop the machine, apply any pending image or config updates, and restart it. The machine will be briefly offline.
- **OpenClaw Doctor** — Run diagnostics and auto-fix common issues

For full details on each control and when to use them, see the [Dashboard Reference](/docs/accureclaw/dashboard).

### Changelog

The dashboard shows recent platform updates. Some updates include a deploy hint — either **Redeploy Required** or **Redeploy Suggested** — to let you know when to redeploy your instance.

### Pairing Requests

When you initialize a new channel for the first time, or a new device connects to the Control UI, you'll see a pairing request on the dashboard that you need to approve. See [Pairing Requests](/docs/accureclaw/chat-platforms#pairing-requests) for details.

## Accessing Your Agent

1. Click **Open** on your dashboard to launch the OpenClaw web interface

{% image src="/docs/img/accureclaw/openclaw-dashboard.png" alt="OpenClaw web interface" width="800" caption="OpenClaw web UI" /%}

## Using your OpenClaw Agent

OpenClaw lets you customize your own AI assistant that can actually take action — check your email, manage your calendar, control smart devices, browse the web, and message you through Accure Chat or connected third-party channels when something needs attention. It's like having a personal assistant that runs 24/7, with the skills and access you choose to give it.

### Browser Tool

AccureClaw includes a headless Chromium browser, enabling your agent to browse the web, take screenshots, and automate web interactions using the OpenClaw browser tool. This works out of the box with the "full" tool profile — no additional setup needed.

### Default Tool Profile

New AccureClaw instances deploy with the **full** tool profile by default, giving your agent unrestricted access to all available tools — filesystem operations, shell execution, web search, browser automation, messaging, memory, sub-agents, and more.

For more information on use cases:

- [OpenClaw Showcase](https://docs.openclaw.ai/start/showcase)
- [100 hours of OpenClaw in 35 Minutes](https://www.youtube.com/watch?v=_kZCoW-Qxnc)
- [Clawhub](https://clawhub.ai/): search for skills

## Related

- [Dashboard Reference](/docs/accureclaw/dashboard)
- [Connecting Chat Platforms](/docs/accureclaw/chat-platforms)
- [Troubleshooting](/docs/accureclaw/troubleshooting)
- [AccureClaw Pricing](/docs/accureclaw/faq/pricing)
- [Gateway Usage and Billing](/docs/gateway/usage-and-billing)
- [Agent Manager](/docs/automate/agent-manager)
- [OpenClaw Documentation](https://docs.openclaw.ai)
