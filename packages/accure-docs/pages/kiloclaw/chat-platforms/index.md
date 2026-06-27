---
title: "Chat Platforms"
description: "Use Accure Chat or connect your AccureClaw agent to Telegram, Discord, and Slack"
---

# Chat Platforms

AccureClaw includes Accure Chat as its first-party channel and also supports connecting your AI agent to messaging platforms so it can receive instructions and send responses directly in your chat apps. You can configure third-party channels from the **Settings** tab on your [AccureClaw dashboard](/docs/accureclaw/dashboard#channels), or from the OpenClaw Control UI after accessing your instance.

## Accure Chat

Accure Chat is the zero-setup, first-party channel for AccureClaw. It is enabled by default, does not require a per-sandbox channel token, and is available from the Accure web and mobile apps as well as supported Accure Code editor and TUI surfaces.

Use Accure Chat when you want to talk to your Claw without configuring a separate bot or app in another messaging platform. For external team chat tools, use one of the third-party channels below.

## Third-Party Platforms

The general steps to connect a third-party chat platform are:

1. Configure the channel token in Settings
2. Redeploy the AccureClaw instance
3. Initiate the pairing in the chat app
4. Accept the pairing request in the [AccureClaw UI](https://app.accurecode.ai/claw)

## Supported Platforms

- [**Accure Chat**](https://app.accurecode.ai) — Use the built-in first-party channel with no token setup.
- [**Telegram**](/docs/accureclaw/chat-platforms/telegram) — Connect via a BotFather bot token.
- [**Discord**](/docs/accureclaw/chat-platforms/discord) — Connect via a Discord Developer Portal bot token.
- [**Slack**](/docs/accureclaw/chat-platforms/slack) — Connect via a Slack app manifest with app-level and bot tokens.
