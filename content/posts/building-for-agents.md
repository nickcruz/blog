---
title: Building for agents != building for humans
description: Throw all your product insights out the door. At least, most of them.
date: "2026-04-14"
slug: building-for-agents
---

:::takeaways
Takeaways

1. Agents are a different kind of user, so optimize for structure output, more specific tool args, and machine-friendly workflows rather than human ergonomics.
2. CLI tooling does a lot of "thinking" an LLM would otherwise spend tokens doing, saving both users and LLMs tokens (time and money).
3. Super-specific tool usage (using a CLI with lots of args) is _okay_ when humans never touch the interface directly as the agent absorbs the complexity for the user.
:::

Last week, my co-founder and I built a CLI tool. Not for humans, for AI agents.

Specifically, we built an [agent skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), so she could analyze her [Instagram content](https://www.instagram.com/its.mikareyes).

![instasights-claude](/20260414/instasights-claude.png)

[Instasights](https://kingscrosslabs.com/instasights) is a skill used by Claude Code or Codex to help you analyze your Instagram account. It's built for creators so they can see what hooks are hitting, which posts/topics are getting them the most followers, etc.

## What is a "skill"?

Agent skills are the latest in AI interfaces—ways for us to interact with LLMs.

We started with `chat` (ChatGPT), then `MCPs`, and now we're at `skills`. In practice we use a combination of any of these depending on the tools we use.

## Anatomy of the Instasights skill

At its core, an agent skill is a `SKILL.md` + any set of supporting files like markdown files, runnable scripts, and reference files.

```
instasights
├── agents
│   └── openai.yaml
├── bin
│   ├── instasights-updater.mjs
│   ├── instasights.mjs
│   └── instasights.version.json
├── CLI.md
├── instasights
└── SKILL.md
```

- `SKILL.md`: **Required.** The core file: a set of instructions for an agent. An agent will read this if the skill itself (`instasights/`) is invoked.
- `CLI.md`: A longer markdown file that is a full reference to the CLI tool.
- `instasights`: A bash script that is a shortcut to `/bin/instasights.mjs`.
- `instasights.mjs`: The prebuilt Node.js script, already packaged and ready to run with `node ./bin/instasights.mjs` by an LLM.

_You can view the full skill in the [Github here](https://github.com/nickcruz/instasights/tree/main/skills/instasights)._

The full `skills/instasights` folder is all just a `SKILL.md` (set of instructions) with supporting files for actually doing things (`CLI.md`, more instructions + `instasights.mjs`, the actual CLI).

## CLI as a frontend, Agents as a user

I've built lots of frontend clients over the years: Android and iOS apps, web frontends, browser extensions. This is my first CLI! This is also my first time building for a non-human.

However, the platform is not what makes this different. It's the type of user that gave interesting challenges (an AI agent).

It's not surprising that CLIs are just another frontend. In modern programming, most frontends can do a _lot_, and CLIs can interact with backends in similar ways:
- They are typically used by a human
- They use OAuth to access a database
- They are generally stateless, with exceptions (auth)
- People spend time making them pretty! Sometimes.

Agents however, are very different from humans:

Category | Humans | Agents
---|---|---
📖 Reading | Prefer unstructured, clean text | Prefer JSON/structured text
👀 Viewing | Prefer nice UI | Can't really see nice UI
✍️ Writing | Typing | Printing entire files in parallel
🧠 Memory | Remembers stuff, such as how they feel about you | Most of the time, no memory
🐞 Bugs | Bugs erode trust (see: memory) | All good, will find a way
💰 Cost | Time | Tokens (money)

Since it's not a GUI, a CLI-based tool is a unique frontend in that either a human or agent can use it optimally.

However, Instasights optimizes for an agent user:
- Logging is verbose (for humans) but **outputs as JSON** (for agents).
- There are **a LOT of CLI args**, but agents don't mind filling out terminal-wide commands full of args.

This is okay, _particularly because humans won't be using it_. A human will use it _through_ their agent, allowing the friction of using the CLI to be quite high, as the agent figures out what it needs.

## Doing the thinking for the LLM

By far the strongest benefit for a CLI-based skill was to save tokens. Particularly my co-founder runs the $20 Claude plan (like many folks) so she runs into usage limits constantly.

MCPs are significantly more expensive, as they're just a new acronym for "API". The expense comes from all of the "gluing" of the different MCP and API calls being left as an exercise for the LLM. More thinking → more tokens → sad human. 🙁

I built the CLI args around common workflows that the `SKILL.md` would have otherwise "instructed" to an MCP:

Operation | MCP | CLI
---|---|---
Auth | "Log in with OAuth 2.0 with the `/login` endpoint" | `./instasights auth login`
Instagram Sync | "After starting the sync, poll the sync enpdoint for status updates" | `./instasights sync --wait`
Clean reset to debug/e2e test | "If you find any issues, restart with `/unlink`, `/reset`, `/logout` | `./instasights clean-reset`

## Lessons for next indie hack

Instasights was an indie hack we're building to experiment and learn new things as we build out our company. It's a free tool for both my co-founder and others like her can use to help them with their content creation.

The biggest learning for me wasn't just how to build the CLI, but "agent as a user" paradigm that is quite new. Virtually all LLM inference was pushed to the user, so maintenance is quite slim for the tool, and most power users want agentic interfaces anyways.

I think we'll be shipping `skills` instead of just `frontends` for a while.
