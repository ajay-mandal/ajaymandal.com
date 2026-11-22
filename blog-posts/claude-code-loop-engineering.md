---
title: "Loop Engineering with Claude Code"
slug: claude-code-loop-engineering
pubDatetime: 2026-10-03T12:00:00.000Z
modDatetime: 2026-11-16T20:11:30.238Z
draft: false
category: findings
tags:
  - claude-code
  - claude
  - ai-agents
  - automation
  - productivity
description: "Keep Claude Code working until the job is done: /loop for polling, /goal for end conditions, Stop hooks for checks, and how to design loops that stop."
---

Claude Code works in a loop: gather context, act, check the result, repeat. Out of the box, _Claude_ decides when it's done. Loop engineering means taking control of that decision: what starts the next turn, how the work gets verified, and when it stops. Claude Code gives you three tools for it: `/loop` (run on a timer), `/goal` (run until a condition holds) and Stop hooks (your own check after every turn).

"Loop engineering" isn't an official term; it's what I call designing the loop _around_ the agent rather than just writing a better prompt. In my experience it's the difference between an agent that says "done!" with failing tests and one that comes back only when the build is green.

This post builds on [Claude Code Hooks: A Practical Guide](/blog/claude-code-hooks-guide). You don't need to read it first, but the Stop hook section will make more sense if you have.

## The Agentic Loop

![The agentic loop: gather context, take action, verify the result. A verify step that fails sends Claude back to act; one that passes ends the turn. /loop, /goal and Stop hooks each decide when the next turn starts.](@assets/images/claude-code-loop-engineering/agentic-loop.svg)

Every Claude Code turn runs the same cycle:

1. **Gather context:** read files, search the code, run commands.
2. **Take action:** edit code, run a migration, open a PR.
3. **Verify:** check whether the action worked.

Claude is good at the first two. The weak point is the third step, and the decision that follows it: "am I finished?" Left alone, the model makes that call itself, and it tends to be optimistic. It ran the tests once and they passed, so it stops, even though it then changed two more files.

The fix isn't a sterner prompt. It's giving the loop two things it doesn't have by default:

- **A check that doesn't rely on the model's own opinion**: a test run, a build exit code, a lint result.
- **A trigger for the next turn** that isn't you typing "keep going".

## Three Ways to Keep Claude Going

| Tool      | Next turn starts when      | Stops when                                                      | Lives in                          |
| :-------- | :------------------------- | :-------------------------------------------------------------- | :-------------------------------- |
| `/loop`   | A time interval passes     | You stop it, Claude decides it's done, or 7 days pass           | The current session               |
| `/goal`   | The previous turn finishes | A separate model confirms your condition is met (or impossible) | The current session               |
| Stop hook | The previous turn finishes | Your script or prompt says so                                   | A settings file, so every session |

The quick way to choose: **waiting on something external** (CI, a deploy, review comments)? Use `/loop`. **A clear finish line for work Claude is doing** (tests pass, every call site migrated)? Use `/goal`. **A rule that should apply to every session** ("never hand back with a broken build")? Use a Stop hook.

## /loop: Work on a Timer

`/loop` re-runs a prompt while your session stays open. Both the interval and the prompt are optional, and what you give it changes how it behaves:

| You type                                                    | What happens                                                                |
| :---------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `/loop 5m check if the deploy finished`                     | Runs your prompt every 5 minutes                                            |
| `/loop check whether CI passed and address review comments` | Runs your prompt; Claude picks the wait (1 minute to 1 hour) after each run |
| `/loop 15m`                                                 | Runs the built-in maintenance prompt every 15 minutes                       |
| `/loop`                                                     | Runs the built-in maintenance prompt at a self-paced interval               |

Intervals use `s`, `m`, `h` and `d`, or a trailing clause like `every 2 hours`. Under the hood they become cron expressions with one-minute granularity, so `30s` rounds up to a minute, and odd values like `7m` get rounded to the nearest clean step (Claude tells you what it picked).

### Let Claude pick the interval

Leaving the interval out is usually the better choice. After each run, Claude picks the next wait based on what it saw: short while a build is running or a PR is busy, longer when nothing's happening. It prints the delay and the reason each time, and when the work is finished it can end the loop itself. Where the Monitor tool is available, Claude may stream a background script's output instead of polling at all, which is cheaper and reacts faster.

### The built-in maintenance prompt and loop.md

A bare `/loop` runs a built-in prompt that, in order, continues unfinished work from the conversation, tends to the current branch's PR (review comments, failed CI, merge conflicts), and otherwise does cleanup passes like bug hunts. It won't start new initiatives, and it only pushes or deletes when the conversation already authorized it.

To replace it with your own default, create `.claude/loop.md` (per project) or `~/.claude/loop.md` (everywhere). It's plain Markdown, written as if you were typing the prompt:

```markdown
Check the open PR for this branch. If CI is red, read the failing job log,
find the cause and push a minimal fix. If there are new review comments,
address each one. If everything is green and quiet, say so in one line.
```

Edits take effect on the next run, so you can tune it while the loop is going.

You can also loop a skill: `/loop 20m /review-pr 1234` re-runs that skill each time.

### Stopping and limits

- Press `Esc` while a self-paced loop is waiting to cancel it. Fixed-interval loops are scheduled tasks; ask Claude "what scheduled tasks do I have?" and "cancel the deploy check".
- A session holds up to 50 scheduled tasks, and recurring ones expire after 7 days, so a forgotten loop can't run forever.
- Tasks only fire while Claude Code is open and idle. They wait for the current turn to finish rather than interrupting it, and missed runs don't pile up.
- Fixed intervals get a small, consistent offset ("jitter") so not every session hits the API at the same moment. An hourly job can fire up to 30 minutes late.

For work that should run without your laptop, like a nightly dependency check, use [cloud routines](https://code.claude.com/docs/en/routines) (via `/schedule`) or Desktop scheduled tasks. `/loop` is for watching things during a working session.

## /goal: Work Until a Condition Holds

`/goal` is the tool I reach for most. You give it a finish line, and Claude keeps taking turns until it's crossed:

```text
/goal all tests in test/auth pass and npm run lint exits 0, without modifying any test files
```

Setting the goal starts work immediately. After every turn, a separate small, fast model reads the conversation and returns one of three verdicts:

- **Not yet met:** Claude starts another turn and uses the evaluator's reason as guidance.
- **Met:** the goal clears and you get control back.
- **Impossible:** the goal clears with an explanation of why.

Having a _different_ model judge completion is the key idea. The model doing the work is the one that wants to be finished; the evaluator has no stake in it.

### Writing a condition that works

The evaluator doesn't run commands or read files. It only judges what Claude has shown in the conversation. So write the condition as something Claude's own output can prove:

- **One measurable end state:** a test result, an exit code, a file count, an empty queue.
- **How to prove it:** "`npm test` exits 0", "`git status` is clean".
- **What must not change:** "without modifying any test files", "no changes outside `src/auth`".
- **A limit:** "or stop after 20 turns". Claude reports progress against it each turn.

Weak: `/goal make the auth module better`. Nothing measurable, so the evaluator is guessing.

Strong: `/goal every file in src/legacy imports from the new api client, npm run build exits 0, or stop after 15 turns`.

### Running it unattended

A goal doesn't change your permission mode. In manual mode Claude still asks before tool calls you haven't allowed, so a goal will sit waiting for you. To let it run on its own, use auto mode: auto mode removes the per-tool prompts, and `/goal` removes the per-turn ones.

It also works headless, which is handy for scripts and CI:

```bash
claude -p "/goal CHANGELOG.md has an entry for every PR merged this week" --output-format stream-json --verbose
```

Check status any time with `/goal` (condition, turns, token spend, latest reason), and cancel with `/goal clear`. If Claude keeps answering the evaluator without actually doing anything (no tool calls several turns in a row), Claude Code stops the loop and hands control back to you.

## Stop Hooks: Your Own Exit Check

`/goal` is per session. A Stop hook lives in your settings, so it applies to every session in its scope. It runs each time Claude finishes a reply, and if it blocks, Claude keeps working. (In fact `/goal` is built on a session-scoped Stop hook.)

Here's the one I'd use on this site's repo, where `npm run build` is the type-check. It refuses to let Claude hand back while the build is broken:

```bash
#!/bin/bash
# .claude/hooks/build-must-pass.sh
INPUT=$(cat)

# Already continuing because of this hook? Let Claude stop.
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0
fi

# Nothing changed in TypeScript files? Skip the build.
cd "$CLAUDE_PROJECT_DIR" || exit 0
if git diff --quiet -- '*.ts' '*.tsx' && git diff --cached --quiet -- '*.ts' '*.tsx'; then
  exit 0
fi

if ! OUTPUT=$(npm run build 2>&1); then
  echo "The build is failing. Fix these errors before finishing:" >&2
  echo "$OUTPUT" | tail -40 >&2
  exit 2
fi
exit 0
```

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/build-must-pass.sh",
            "timeout": 180
          }
        ]
      }
    ]
  }
}
```

Three details make or break a Stop hook:

- **It fires after every reply**, not just when a task is done. That includes Claude answering a quick question. That's why the script checks `git diff` first: no changed TypeScript, no build.
- **Exit 2 sends stderr to Claude.** The last 40 lines of build output become Claude's next instruction, so it knows exactly what to fix.
- **It needs an exit.** A Stop hook that always blocks traps Claude in a loop. Claude Code steps in after 8 blocks in a row without progress, but don't rely on that. The input includes `stop_hook_active`, which is `true` when Claude is already continuing because of a Stop hook. Exiting early when it's set, as above, gives Claude one extra pass to fix the build, then lets it stop and tell you what's still wrong. For more passes, track attempts in a temp file, or raise the cap with `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` if you understand the risk.

When the check needs judgment rather than a script, use a `prompt` hook (one model call that returns `{"ok": false, "reason": "..."}`) or the experimental `agent` hook, which can run commands itself to verify. The [hooks guide](/blog/claude-code-hooks-guide#hooks-that-use-judgment-prompt-and-agent-hooks) shows both.

## Designing a Good Loop

The tools are simple. Getting value from them is mostly about design. These are the rules I follow:

**1. Make "done" machine-checkable.** Every good loop ends on a check that doesn't depend on the model's opinion: tests, a build, a linter, a type-check, a screenshot diff, `git status`. If you can't write the check down, the loop has nothing reliable to stop on, and you're back to trusting "looks good to me".

**2. Shorten the feedback loop inside each turn.** The cheapest fix is the one Claude makes straight after the mistake. A `PostToolUse` hook that lints the edited file and exits 2 on errors catches problems in seconds, so the expensive end-of-turn check (full build, full test suite) usually passes first time.

**3. Choose the trigger that matches what you're waiting for.**

| You're waiting for                              | Use                          |
| :---------------------------------------------- | :--------------------------- |
| Something outside Claude (CI, deploy, reviewer) | `/loop`, self-paced          |
| Work with a clear finish line                   | `/goal`                      |
| A rule for every session                        | Stop hook                    |
| Work that runs without your machine             | Cloud routines (`/schedule`) |

**4. Always bound the loop.** Put a turn limit in `/goal` conditions, use `stop_hook_active` in Stop hooks, and remember `/loop` expires after 7 days. An unbounded loop is how you wake up to a large bill and 300 commits.

**5. Put guardrails in hooks, not in prompts.** An unattended loop in auto mode needs hard limits. A `PreToolUse` hook that denies `git push --force` or edits to `.env` still applies in auto and bypass modes. "Please don't force-push" in a prompt doesn't.

**6. Don't pay for polling you don't need.** Let `/loop` pick its own interval, so it backs off when nothing's happening. Prefer streaming tools (Monitor, CI that pushes events into the session) over checking every minute. And keep end-of-turn checks cheap: skip them when nothing relevant changed.

**7. Keep the loop's instructions in files.** `loop.md`, hook scripts and `CLAUDE.md` are versioned, reviewable and shared with your team. A clever prompt in your shell history isn't.

## Putting It Together

Here's how the pieces combine on a real task, migrating a module to a new API client:

1. **Guardrails** (`PreToolUse`, committed): block `.env` edits and force pushes.
2. **Fast feedback** (`PostToolUse`): lint each edited file and send errors back to Claude.
3. **Exit check** (`Stop`): no handing back with a broken build.
4. **The work** (`/goal`, in auto mode): `/goal every import of old-client in src/ is replaced, npm run build exits 0, no test files modified, or stop after 25 turns`.
5. **After pushing** (`/loop`): `/loop watch CI for this PR and fix any failures`.

Each layer handles one thing: hooks enforce rules, the goal defines done, the loop watches the world. Claude does the work in the middle, and you get control back when there's actually something to look at.

## Resources

- [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal): official `/goal` docs
- [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks): `/loop`, `loop.md`, cron tasks and limits
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide): prompt and agent hooks, the Stop hook block cap
- [Claude Code Hooks: A Practical Guide](/blog/claude-code-hooks-guide): events, config and five hooks worth adding
- [Claude Skills: Build Your Own and Use the Best](/blog/claude-skills-guide): teaching Claude your workflows
