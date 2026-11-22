---
title: "Claude Advisor Tool: How It Works and Costs"
slug: claude-advisor-tool
pubDatetime: 2026-11-17T10:00:00.000Z
draft: false
category: findings
tags:
  - claude-code
  - claude
  - claude-api
  - ai-agents
  - cost-optimization
description: "Claude's advisor tool lets a cheaper model ask a stronger one for help mid-task. How it works, how to enable it in Claude Code and the API, and the cost."
---

**TL;DR:** The Claude advisor tool pairs a cheaper main model (the executor) with a stronger one (the advisor). The executor does the work and asks the advisor for guidance only at decision points: before it picks an approach, when it's stuck, and before it says it's done. You get close to the stronger model's quality, and most tokens are billed at the cheaper model's rate.

Everything here comes from Anthropic's own docs. The advisor tool is in beta (in Claude Code it's labelled experimental), so names, pricing and availability can change. Check the sources at the bottom before you rely on a detail.

If you want the bigger picture of how Claude Code runs its work, [Loop Engineering with Claude Code](/blog/claude-code-loop-engineering) covers the loop the advisor plugs into.

## What the Claude advisor tool does

Think of a senior engineer who reviews the plan but never touches the keyboard. The executor (say Sonnet) reads files, runs commands and writes code. When it hits a decision it can't reasonably solve, it calls the advisor (say Opus).

The advisor reads the whole conversation, including every tool call and result. It sends back a short plan or a course correction. Then the executor carries on.

![The advisor flow: the executor works through a task, calls the advisor at a decision point, gets short guidance back and continues.](@assets/images/claude-advisor-tool/advisor-flow.svg)

- The advisor never acts. It has no tools and produces no user-facing output. It only gives guidance.
- The executor decides when to call it, the same way it decides to use any other tool.
- The advisor writes very little. Anthropic says a typical call is 400 to 700 text tokens, or 1,400 to 1,800 with thinking.

## Which surface should you use?

There are three ways to use the advisor. They share the idea but have different controls.

| Surface | How you enable it | What you control |
| :-- | :-- | :-- |
| Claude Code | `/advisor`, the `advisorModel` setting, or `--advisor` | Which model advises. No cap on calls |
| Messages API | Add a tool of type `advisor_20260301` and a beta header | `max_uses`, `max_tokens`, `caching` |
| Managed Agents | Set `advisor` in the agent's `multiagent` block | Model only. No `max_uses`, `max_tokens` or caching |

> The advisor isn't available on Amazon Bedrock, Google Cloud's Agent Platform or Microsoft Foundry. Claude Code and the Messages API work on the Anthropic API, Claude Platform on AWS and Claude Models on Google Cloud (Anthropic managed). Managed Agents lists the Claude API and Claude Platform on AWS only.

## Use it in Claude Code

Pick one of these:

```text
/advisor opus
```

That sets the advisor for the session and saves it as your default. Run `/advisor` with no argument to open a picker, or `/advisor off` to turn it off.

For a persistent default, add it to your settings file:

```json
{
  "advisorModel": "opus"
}
```

For one session only, launch with the flag:

```bash
claude --advisor opus
```

The aliases are `fable`, `opus` and `sonnet`. You can also pass a full model ID such as `claude-opus-5-5`.

### Which pairings work

The advisor must rank at or above your main model. Anthropic's examples:

| Pairing | Good for |
| :-- | :-- |
| Sonnet main + Opus advisor | Sonnet does routine work and escalates planning, odd failures and completion checks to Opus |
| Haiku main + Opus advisor | The cheapest main model with strong planning. Costs more than Haiku alone, less than switching to Sonnet or Opus |
| Opus main + Opus advisor | A second Opus reviews the first. For high-stakes work where an independent check matters more than cost |
| Sonnet main + Sonnet advisor | A cheap second opinion that catches routine oversights |
| Fable main + Fable advisor | The strongest pairing, if you have Fable access |

Haiku 4.5 can call an advisor but can't be one. If the advisor ranks below your main model, Claude Code doesn't attach it and says so in the `/advisor` output.

### What you see while it runs

When Claude calls the advisor, the transcript shows an `Advising` line with the model name. When it finishes, the line says one of three things:

- Reviewed: the advisor looked at the conversation. If the advice is readable, press `Ctrl+O` to see it.
- Declined: `Advisor declined to advise on this request`.
- Unavailable: `Advisor unavailable (<error_code>)`. The call failed and Claude carries on without it.

You can ask for a consult in plain words, like `consult the advisor before you continue`. There's no setting to force or cap calls.

Claude mostly follows the advice. If a recommended step fails when it tries it, or the file contents contradict the advice, it points out the conflict instead of obeying blindly.

## Use it in the API

Add the beta header `anthropic-beta: advisor-tool-2026-03-01` and put the advisor in `tools`. This is adapted from Anthropic's example:

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-5",  # the executor
    max_tokens=16000,
    betas=["advisor-tool-2026-03-01"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-5-5",  # the advisor
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Build a concurrent worker pool in Go with graceful shutdown. Keep it brief.",
        }
    ],
)
```

The whole handoff happens inside one `/v1/messages` request. The top-level `max_tokens` limits the executor's output only.

### Tool parameters

| Parameter | Default | What it does |
| :-- | :-- | :-- |
| `type` | required | Must be `advisor_20260301` |
| `name` | required | Must be `advisor` |
| `model` | required | The advisor model. Billed at its rates |
| `max_uses` | unlimited | Max advisor calls per turn. After that, calls return `max_uses_exceeded` and the executor continues alone |
| `max_tokens` | the advisor's output cap | Caps advisor output per call. Minimum 1024 |
| `caching` | off | `{"type": "ephemeral", "ttl": "5m"}` or `"1h"`. Turns on advisor-side prompt caching |

### What comes back

A successful call gives you a `server_tool_use` block (always an empty `input`) followed by an `advisor_tool_result` block.

Whether you can read the advice depends on the advisor model. Opus 4.8 returns plain text (`advisor_result`). Opus 5.5, Sonnet 5.5, Haiku 5.5 and the Fable and Mythos models return encrypted output (`advisor_redacted_result`). Your code can't read it, but the executor can. If you need to read the advice, use `claude-opus-4-8` as the advisor, where the pairing allows it.

If the advisor fails, you don't get a failed request. You get an `advisor_tool_result_error` such as `max_uses_exceeded`, `overloaded` or `prompt_too_long`, and the executor keeps going without advice.

On later turns, send the full assistant content back, including the advisor result blocks, unchanged.

## My setup: Sonnet 5.5 with a Fable 5.2 advisor

I run Sonnet 5.5 as the executor and Fable 5.2 as the advisor. Anthropic's docs accept this pairing in both Claude Code and the API. For Sonnet, they say an Opus advisor keeps total cost similar or lower, and that Fable gives the biggest quality lift.

In Claude Code:

```text
/advisor fable
```

Or launch with `claude --advisor fable`. You need Fable access and Claude Code v2.1.321 or later. On some plans, Fable usage bills to usage credits, so Claude Code asks for a one-time consent first. Until you give it, `/advisor fable` isn't saved. Run `/model fable`, accept the consent, then pick Fable as the advisor.

In the API, change the two model IDs from the earlier example:

```python
response = client.beta.messages.create(
    model="claude-sonnet-5-5",  # the executor
    max_tokens=16000,
    betas=["advisor-tool-2026-03-01"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-fable-5-2",  # the advisor
        }
    ],
    messages=[{"role": "user", "content": "..."}],
)
```

A Sonnet 5.5 executor pairs only with encrypted advisors, and Fable 5.2 is one of them. Your client can't read the advice text. The executor can. Fable is billed at its own rates, so the same cost levers apply: `max_uses`, `max_tokens` and a short-advice line in the prompt.

## Where the savings come from

Advisor calls are billed as a separate sub-inference at the advisor model's rates. Executor tokens are billed at the executor's rates. The saving comes from the split: the cheaper model writes the bulk of the output, and the expensive one writes a short plan now and then.

Anthropic's launch post (April 2026) reported these numbers. They were measured on the models available in April 2026, with Sonnet or Haiku as the executor and Opus as the advisor, so treat them as an illustration and not a promise for today's models:

| Benchmark | Result |
| :-- | :-- |
| SWE-bench Multilingual | Sonnet with an Opus advisor scored 2.7 points higher than Sonnet alone and cut cost per task by 11.9% |
| BrowseComp | Haiku with an Opus advisor scored 41.2%, up from 19.7% for Haiku alone |
| Haiku + Opus vs Sonnet alone | Trailed Sonnet by 29% in score but cost 85% less per task |

The docs also say results depend on the task, and they tell you to test on your own workload. Run your evals three ways: executor alone, executor with advisor, and the stronger model alone.

### Caveats

- Haiku with an advisor costs more than Haiku alone.
- For Sonnet with an Opus advisor on complex tasks, the docs say total cost stays similar or lower, which isn't a guarantee of lower.
- Claude Code warns that the advisor "may use more tokens".
- The saving is measured against running the stronger model for the whole task.

### Cost levers (API)

| Lever | What to do |
| :-- | :-- |
| Cap calls | Set `max_uses`. It limits calls per turn |
| Cap output | Set `max_tokens`. The docs suggest starting at 2048, which cut advisor output from about 4,200 to 5,900 tokens down to about 630 to 840 in their test |
| Trim the advice | Add a line to the user message such as `(Advisor: please keep your guidance under 80 words...)`. The docs say to ask for about 80% of your real ceiling, since it's a soft limit |
| Use caching | Set `caching`, but only if you expect three or more advisor calls in a conversation. That's roughly the break-even. Don't toggle it mid-conversation |
| Lower executor effort | A Sonnet executor at medium effort with an Opus advisor reaches Sonnet-default-effort intelligence at lower cost, for coding |
| Set a hard ceiling | There's no conversation-level cap, so count calls in your code and remove the tool when you hit your limit |

### Reading the bill

Advisor tokens don't appear in the top-level `usage` totals. Look at `usage.iterations[]` instead:

- `type: "message"` entries are billed at executor rates.
- `type: "advisor_message"` entries (with a `model` field) are billed at advisor rates.

In Claude Code, advisor usage counts toward the session totals in `/usage`. On subscription plans it counts toward your plan limits, except that a Fable advisor bills to usage credits on plans where Fable usage does. On API billing you pay the advisor model's input and output rates. The docs list no per-token prices on these pages, so use Anthropic's pricing page for current rates.

One Claude Code detail: the advisor's own read of the conversation isn't cached, so each call processes the full transcript fresh. Turning the advisor on or off mid-session doesn't invalidate your main model's cache.

## Getting better advice, at the right time

Anthropic's docs suggest calling the advisor early, after a few orientation reads and before real work starts. They also suggest calling it once more before declaring done on hard tasks. Their sample coding prompt says to make your deliverable durable before that final call, so the work survives if the session ends.

- If a Haiku executor hasn't called the advisor by its first turn, a reminder message before turn 2 raised pass rates by about 7 points in Anthropic's testing on Haiku 4.5. It had no measurable effect on Sonnet and slightly lowered Opus, so measure your own baseline first.
- `tool_choice: {"type": "tool", "name": "advisor"}` forces a consult on some executors. Fable 5.2, Opus 5.5, Sonnet 5.5 and a few others reject it, so use a prompt nudge there.

## When not to use it

The advisor adds less on:

- Short tasks with little to plan, like single-turn Q&A.
- Work where every turn needs the strongest model. Just switch the main model.

Other ways to mix model strengths in Claude Code:

| Approach | When the stronger model runs |
| :-- | :-- |
| Advisor | At decision points mid-task, when Claude asks |
| `opusplan` | During plan mode, then Sonnet executes |
| Subagent with a `model` set | For the whole delegated subtask |
| `/model` | From the next request onward |

## Takeaways

- In Claude Code, `/advisor opus` is the whole setup.
- In the API, `max_uses`, `max_tokens` and `caching` keep the cost in check.
- Savings are measured against running the big model the whole way. Haiku plus an advisor costs more than Haiku alone.
- It's beta. Run your own evals before you trust a number.

## Sources

- [Advisor tool in the Claude API docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)
- [Escalate hard decisions with the advisor tool (Claude Code docs)](https://code.claude.com/docs/en/advisor)
- [The advisor strategy (Anthropic blog, April 9, 2026)](https://claude.com/blog/the-advisor-strategy)
