# Dedicated Output Channel

**Priority:** P2

Agent Manager has its own output channel. No general "Accure Code" output channel exists.

## Remaining Work

- Create `vscode.window.createOutputChannel("Accure Code")` during activation
- Centralized logging utility with log levels (debug, info, warn, error)
- Route all `[Kilo New]` log messages to this channel
- Dispose on deactivation
- Migrate existing `console.log("[Kilo New] ...")` calls to the logger
