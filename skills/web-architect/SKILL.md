---
name: web-architect
description: >
  4-agent orchestrator for full design-to-code pipelines. Conducts Designer, Architect,
  Builder, and Reviewer agents through Constrained Generation for unique design systems.
  8 project profiles, 5-dimension quality scoring, self-learning loop.
tags:
  - web-development
  - design-system
  - frontend
  - multi-agent
  - orchestrator
  - accessibility
  - react
  - nextjs
  - tailwindcss
source: https://github.com/choppawave-beep/web-architect
---

# Web Architect

One command, four agents, zero generic output.

Orchestrates a full design-to-code pipeline for any web project via 4 specialized subagents:

1. **Designer** — Constrained Generation for unique palettes, font pairings, motion tokens
2. **Architect** — Component tree, file structure, data flow planning
3. **Builder** — Implementation using design tokens, no hardcoded values
4. **Reviewer** — 5-dimension quality scoring (design, a11y, perf, code, architecture)

## Install

```bash
npx skills add choppawave-beep/web-architect
```

## Commands

- `/wa:design [desc]` — Full pipeline
- `/wa:build [desc]` — Build with existing design system
- `/wa:review` — Quality audit
- `/wa:profile [type]` — Set project type (landing|saas|dashboard|ecommerce|crm|portfolio|blog|desktop)
