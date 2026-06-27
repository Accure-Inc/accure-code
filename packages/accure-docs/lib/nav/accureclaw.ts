import { NavSection } from "../types"

export const AccureClawNav: NavSection[] = [
  {
    title: "AccureClaw",
    links: [
      { href: "/accureclaw/overview", children: "Overview" },
      { href: "/accureclaw/dashboard", children: "Dashboard" },
      { href: "/accureclaw/pre-installed-software", children: "Pre-installed Software" },
      { href: "/accureclaw/end-to-end", children: "End to End Config" },
      {
        href: "/accureclaw/control-ui/overview",
        children: "Control UI",
        subLinks: [
          { href: "/accureclaw/control-ui/overview", children: "Overview" },
          { href: "/accureclaw/control-ui/changing-models", children: "Changing Models" },
          { href: "/accureclaw/control-ui/exec-approvals", children: "Exec Approvals" },
          { href: "/accureclaw/control-ui/version-pinning", children: "Version Pinning" },
        ],
      },
      {
        href: "/accureclaw/chat-platforms",
        children: "Chat Platforms",
        subLinks: [
          { href: "/accureclaw/chat-platforms", children: "Overview" },
          { href: "/accureclaw/chat-platforms/telegram", children: "Telegram" },
          { href: "/accureclaw/chat-platforms/discord", children: "Discord" },
          { href: "/accureclaw/chat-platforms/slack", children: "Slack" },
        ],
      },
      {
        href: "/accureclaw/development-tools",
        children: "Integrations",
        subLinks: [
          { href: "/accureclaw/development-tools", children: "Overview" },
          { href: "/accureclaw/development-tools/github", children: "GitHub" },
          { href: "/accureclaw/development-tools/google", children: "Google Workspace" },
          { href: "/accureclaw/development-tools/linear", children: "Linear" },
          { href: "/accureclaw/development-tools/composio", children: "Composio" },
          { href: "/accureclaw/tools/1password", children: "1Password" },
          { href: "/accureclaw/tools/brave-search", children: "Brave Search" },
          { href: "/accureclaw/tools/agentcard", children: "AgentCard" },
          { href: "/accureclaw/tools/other-tools", children: "Other Tools" },
        ],
      },
      {
        href: "/accureclaw/triggers",
        children: "Triggers",
        subLinks: [
          { href: "/accureclaw/triggers", children: "Overview" },
          { href: "/accureclaw/triggers/webhooks", children: "Webhooks" },
          { href: "/accureclaw/triggers/scheduled", children: "Scheduled" },
        ],
      },
      {
        href: "/accureclaw/troubleshooting/common-questions",
        children: "Troubleshooting",
        subLinks: [
          { href: "/accureclaw/troubleshooting/common-questions", children: "Common Questions" },
          { href: "/accureclaw/troubleshooting/gateway-process", children: "Gateway Process States" },
          { href: "/accureclaw/troubleshooting/architecture", children: "Architecture Notes" },
        ],
      },
      {
        href: "/accureclaw/faq/general",
        children: "FAQ",
        subLinks: [
          { href: "/accureclaw/faq/general", children: "General" },
          { href: "/accureclaw/faq/pricing", children: "Pricing" },
        ],
      },
    ],
  },
]
