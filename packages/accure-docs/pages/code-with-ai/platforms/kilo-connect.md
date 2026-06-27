---
title: "Accure Connect"
description: "Use Accure Code from Slack, GitHub, and Linear, and connect DoltHub data"
---

# Accure Connect

**Accure Connect** brings Accure Code into the tools your team already uses. Instead of switching to a separate interface, you can trigger implementations, ask questions, and get pull requests opened from your chat, issue tracker, or code review workflow. You can also connect DoltHub as a data source for Dolt-versioned data.

---

## Supported Integrations

| Integration | Entry Point | What It Can Do |
|---|---|---|
| [Slack](/docs/code-with-ai/platforms/slack) | `@Accure` in any channel or DM | Ask questions, implement fixes, debug issues |
| [GitHub](/docs/code-with-ai/platforms/github) | `@accurecode-bot` on issues and PRs | Fix issues, review code, cross-repo changes |
| [Linear](/docs/code-with-ai/platforms/linear) | `@accure` on any issue | Implement fixes, investigate bugs, cross-repo changes |
| DoltHub | [Connect DoltHub](https://app.accurecode.ai/integrations/dolthub) from Integrations | Query Dolt-versioned data from your workspace |

---

## How to Set Up

All integrations are configured from the **Integrations** tab at [app.accurecode.ai](https://app.accurecode.ai). Each integration requires:

- A Accure Code account with available credits
- The specific integration installed and authorized for your workspace
- A connected Git provider (GitHub or GitLab) for repository workflows such as Cloud Agents, Code Reviews, and Accure Deploy
