---
title: "Claude Code Hooks: A Practical Guide"
slug: claude-code-hooks-guide
pubDatetime: 2026-10-03T10:00:00.000Z
modDatetime: 2026-11-16T20:11:29.801Z
draft: false
category: findings
tags:
  - claude-code
  - claude
  - hooks
  - automation
  - productivity
description: "What Claude Code hooks are and how to use them: events, settings.json config, exit codes and JSON output, five useful hooks, and how to debug them."
---

Hooks are shell commands that Claude Code runs automatically at fixed points in a session: before a tool runs, after a file is edited, when Claude finishes a reply, and so on. Instructions in `CLAUDE.md` are requests the model usually follows. A hook runs every single time, so use hooks for anything that must always happen.

I started using hooks after the third time Claude edited a file and forgot to run the formatter, even though `CLAUDE.md` told it to. The model wasn't being careless; it was juggling a lot of context, and "remember to format" lost out. A hook fixed it permanently in four lines of JSON.

This guide covers how hooks work, how to configure them, how a hook talks back to Claude, five hooks worth adding today, and a real setup from this site's repo. If you're new to extending Claude Code, my [Claude Skills guide](/blog/claude-skills-guide) covers the other half: skills teach Claude _how_ to do something, hooks make sure something _always happens_.

## Hooks vs Instructions

Everything you put in `CLAUDE.md`, a skill or a prompt is advisory. The model reads it and decides what to do. Most of the time that's exactly what you want, because judgment is the point of using an AI.

Some rules shouldn't depend on judgment, though:

- Format every file after it's edited.
- Never touch `.env` or `.git/`.
- Never force-push.
- Tell me when you need input, so I can stop watching the terminal.

Those are deterministic rules, and hooks are the deterministic layer. Claude Code runs them itself; the model doesn't decide whether they fire.

## How Hooks Work

![Claude Code session lifecycle showing where hook events fire: SessionStart, UserPromptSubmit, PreToolUse and PostToolUse around each tool call, Stop when Claude finishes, and SessionEnd](@assets/images/claude-code-hooks-guide/hook-lifecycle.svg)

Every hook follows the same cycle:

1. An **event** fires, such as `PreToolUse` just before Claude runs a tool.
2. Claude Code finds every hook registered for that event whose **matcher** fits, and runs them **in parallel**.
3. Each hook receives the event details as **JSON on stdin**.
4. The hook's **exit code** and **stdout** tell Claude Code what to do next: carry on, block the action, or add context for Claude.

There are over 30 events. These are the ones you'll use most:

| Event                        | Fires                                               | Can block?             | Typical use                      |
| :--------------------------- | :-------------------------------------------------- | :--------------------- | :------------------------------- |
| `SessionStart`               | When a session starts, resumes or is compacted      | No                     | Load context, check tooling      |
| `UserPromptSubmit`           | When you send a prompt, before Claude sees it       | Yes                    | Add context, reject prompts      |
| `PreToolUse`                 | Before a tool call runs                             | Yes                    | Guardrails, policy checks        |
| `PermissionRequest`          | When Claude Code is about to ask you for permission | Yes (allow or deny)    | Auto-approve safe calls          |
| `PostToolUse`                | After a tool call succeeds                          | No (it already ran)    | Format, lint, log                |
| `Notification`               | When Claude needs your input or permission          | No                     | Desktop alerts                   |
| `Stop`                       | When Claude finishes a reply                        | Yes (keeps it working) | Final checks before handing back |
| `PreCompact` / `PostCompact` | Before and after context compaction                 | `PreCompact` only      | Preserve key context             |
| `SessionEnd`                 | When the session ends                               | No                     | Cleanup, logging                 |

`Stop` is special: blocking it means "you're not done yet", and Claude keeps working. That's the foundation of self-checking loops, which I cover in [Loop Engineering with Claude Code](/blog/claude-code-loop-engineering).

## Anatomy of a Hook Config

Hooks live in a settings file. Which file you pick decides who the hook applies to:

| File                          | Applies to                 | Commit it?          |
| :---------------------------- | :------------------------- | :------------------ |
| `~/.claude/settings.json`     | All your projects          | No, it's personal   |
| `.claude/settings.json`       | This project, for everyone | Yes                 |
| `.claude/settings.local.json` | This project, just you     | No, it's gitignored |

Plugins, skills and subagents can also bring their own hooks, and organizations can enforce hooks through managed settings.

Here's the shape of a config:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Reading it from the outside in:

- **`hooks`** has one key per event name. Add new events as siblings; don't replace the whole object.
- **`matcher`** filters when the group fires. For tool events it matches the tool name: `Bash`, `Edit|Write`, or a regex like `mcp__github__.*`. An empty string, `*` or no matcher means "every time". Matchers are case-sensitive. Other events match other things; for `SessionStart` it's how the session started (`startup`, `resume`, `compact`).
- **`hooks`** (the inner array) is the list of handlers to run.
- **`type`** is usually `command`. There are also `http` (POST the event to a URL), `mcp_tool`, `prompt` and `agent` hooks; more on the last two below.
- **`timeout`** is in seconds. Command hooks default to 10 minutes, which is far too generous for something that runs on every edit. Set it.

For tool events you can narrow further with **`if`**, which goes on the individual hook and uses permission-rule syntax. This hook only spawns for `git` commands, not every Bash call:

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "if": "Bash(git *)",
      "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-git-policy.sh"
    }
  ]
}
```

`$CLAUDE_PROJECT_DIR` is set to the project root, so scripts work no matter which directory Claude is in.

## How a Hook Talks Back

A hook gets JSON on stdin. Every event includes fields like `session_id`, `cwd`, `transcript_path` and `hook_event_name`; tool events add `tool_name` and `tool_input`. A `PreToolUse` hook for an edit sees something like:

```json
{
  "hook_event_name": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/repo/src/app.ts",
    "old_string": "...",
    "new_string": "..."
  },
  "cwd": "/repo"
}
```

It answers in one of two ways.

**Exit codes** are the simple way:

| Exit code     | Meaning            | What happens                                                                                                                             |
| :------------ | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `0`           | Success            | Carry on. On `SessionStart` and `UserPromptSubmit`, plain stdout is added to Claude's context.                                           |
| `2`           | Blocking error     | Block the action and send stderr to Claude as the reason. On `PostToolUse` the tool already ran, so Claude just sees stderr as feedback. |
| Anything else | Non-blocking error | The action proceeds and you see a "hook error" notice.                                                                                   |

The detail that matters most: **with exit code 2, stderr goes to Claude**. Claude reads the reason and adjusts, so a good error message ("Blocked: `.env` is protected, put config in `config.ts` instead") turns a wall into a hint.

**JSON on stdout** (with exit 0) gives finer control. A `PreToolUse` hook can deny a call with a reason:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Force pushes are not allowed in this repository"
  }
}
```

`permissionDecision` can also be `allow` or `ask`. `PostToolUse` and `Stop` hooks use a top-level `"decision": "block"` with a `"reason"`, and most events accept `additionalContext` to quietly hand Claude extra information.

Two traps catch almost everyone:

- **Fields at the wrong level are silently ignored.** `permissionDecision` belongs inside `hookSpecificOutput`, not at the top level. The JSON still parses, so there's no error; it just does nothing.
- **Anything printed before your JSON breaks it.** Hooks run in a shell, and if your `~/.zshrc` echoes something unconditionally, your output no longer starts with `{` and gets treated as plain text. Wrap profile output in `if [[ $- == *i* ]]; then ... fi` so it only runs in interactive shells.

Build JSON with `jq -n` rather than string concatenation, so quotes inside values are escaped properly.

## Five Hooks Worth Adding

All of these come from, or closely follow, the patterns in the official docs. They use [`jq`](https://jqlang.org/) to parse the input (`brew install jq` on macOS).

### 1. Get notified when Claude needs you

This is the hook I'd install first. It frees you from watching the terminal. Add it to `~/.claude/settings.json` so it works in every project:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

On macOS, if nothing appears, run `osascript -e 'display notification "test"'` once in Terminal, then allow notifications for **Script Editor** in System Settings. It fails silently otherwise. On Linux, swap in `notify-send`.

### 2. Format every edited file

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

The matcher keeps it to file edits, so it doesn't run after every `ls`. It won't catch files changed through Bash (a `sed` one-liner, say); for that, the docs suggest a `FileChanged` hook or a `Stop` hook that checks the working tree once per turn.

### 3. Block edits to protected files

Save this as `.claude/hooks/protect-files.sh` and `chmod +x` it:

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED=(".env" "package-lock.json" ".git/")
for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH is protected ('$pattern'). Ask the user to change it." >&2
    exit 2
  fi
done
exit 0
```

Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

A `PreToolUse` deny is honoured in every permission mode, including bypass mode, so this works as a real guardrail even when you let Claude run unattended.

### 4. Feed lint errors straight back to Claude

Because exit code 2 on `PostToolUse` sends stderr to Claude, you can turn your linter into instant feedback:

```bash
#!/bin/bash
# .claude/hooks/lint-file.sh
FILE=$(jq -r '.tool_input.file_path // empty')
[[ "$FILE" =~ \.(ts|tsx|js|jsx)$ ]] || exit 0

if ! OUTPUT=$(npx eslint "$FILE" 2>&1); then
  echo "ESLint errors in $FILE:" >&2
  echo "$OUTPUT" >&2
  exit 2
fi
```

Claude sees the errors right after its edit and usually fixes them in the next step, without you saying anything. Lint only the edited file; linting the whole project on every edit makes each step slow.

### 5. Re-inject key context after compaction

When a long session fills the context window, Claude Code compacts it into a summary, and small but important details can get lost. A `SessionStart` hook with the `compact` matcher runs right after compaction, and its stdout goes into Claude's context:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: use npm, not yarn. Run npm run build before committing.'; git log --oneline -5"
          }
        ]
      }
    ]
  }
}
```

For context you need in _every_ session, use `CLAUDE.md` instead; this is specifically for what compaction tends to drop.

## A Real Example: This Site's Repo

The repo for this site uses a code knowledge graph ([code-review-graph](https://github.com/tirth8205/code-review-graph)) so Claude can look up symbols and callers instead of grepping through files. A graph is only useful if it's current, so two hooks in `.claude/settings.json` keep it that way. This is the real config, with the absolute repo path swapped for `$CLAUDE_PROJECT_DIR`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cat >/dev/null || true; git rev-parse --git-dir >/dev/null 2>&1 && code-review-graph update --skip-flows --repo \"$CLAUDE_PROJECT_DIR\" || true",
            "timeout": 30
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "cat >/dev/null || true; git rev-parse --git-dir >/dev/null 2>&1 && code-review-graph status --repo \"$CLAUDE_PROJECT_DIR\" || echo 'Not a git repo, skipping'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

A few deliberate choices in there:

- **`cat >/dev/null`** reads and discards the event JSON on stdin, because these hooks don't need it.
- **`git rev-parse --git-dir`** skips the work outside a git repo.
- **`|| true`** makes the update hook always exit 0. A failed graph update should never block Claude's work, so this hook fails open on purpose.
- **Short timeouts** (30s and 10s) because the update runs after every edit.
- **The `SessionStart` output** (node count, last update) goes into Claude's context at the start of each session, so Claude knows the graph exists and how fresh it is before it starts searching.

## Hooks That Use Judgment: Prompt and Agent Hooks

Some checks can't be a shell script, like "did Claude actually finish everything I asked?" For those, a hook can ask a model:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all requested tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains\"}."
          }
        ]
      }
    ]
  }
}
```

A `prompt` hook makes one call to a small, fast model, which returns `{"ok": true}` or `{"ok": false, "reason": "..."}`. On a `Stop` hook, `ok: false` sends the reason back to Claude as its next instruction. An `agent` hook goes further: it spawns a subagent that can read files and run commands to verify, say, that tests pass. Agent hooks are still experimental, so prefer command hooks for anything you rely on.

These are the building blocks for loops that check their own work. I cover them properly, including how to stop a `Stop` hook from looping forever, in [Loop Engineering with Claude Code](/blog/claude-code-loop-engineering).

## Debugging Hooks

When a hook doesn't behave:

1. **Run `/hooks`** in Claude Code to see every configured hook grouped by event. If yours isn't listed, check the file location and look for invalid JSON (trailing commas and comments aren't allowed).
2. **Test the script by hand** with fake input, and check the exit code:
   ```bash
   echo '{"tool_name":"Edit","tool_input":{"file_path":".env"}}' | .claude/hooks/protect-files.sh
   echo $?
   ```
3. **Press `Ctrl+O`** for the transcript view, which shows hook feedback and errors.
4. **Turn on the debug log** with `claude --debug-file /tmp/claude.log`, then `tail -f /tmp/claude.log` to see which hooks matched, their exit codes, stdout and stderr.

The most common culprits: a script that isn't executable (`chmod +x`), a relative path (use `$CLAUDE_PROJECT_DIR`), a missing `jq`, or a matcher with the wrong case (`edit` won't match `Edit`).

## Using Hooks Efficiently

What I've learned from running these daily:

- **Keep them fast.** A `PostToolUse` hook runs after every matching tool call. A 5-second hook on `Edit|Write` adds 5 seconds to every edit. Narrow the matcher, use `if` for Bash, and work on the changed file only.
- **Decide whether each hook fails open or closed.** A formatter should fail open (`|| true`) so it never blocks work. A guardrail should fail closed. Remember that a hook which times out is skipped, so a slow guardrail is a hole in the fence.
- **Make block messages useful.** Claude reads them. Say what was blocked, why, and what to do instead.
- **Put each hook in the right file.** Personal conveniences (notifications) go in `~/.claude/settings.json`. Team rules (formatting, protected files) go in the committed `.claude/settings.json`. Experiments go in `.claude/settings.local.json`.
- **Don't move judgment into hooks.** If a rule needs nuance, it belongs in `CLAUDE.md` or a skill. Hooks are for the things that should never vary.
- **Read hooks before trusting a repo.** Hooks run shell commands with your user permissions. Claude Code asks you to trust a folder before it runs that folder's project hooks, so read `.claude/settings.json` in any repo you clone before you say yes.

## Resources

- [Hooks guide](https://code.claude.com/docs/en/hooks-guide): official walkthrough with more examples
- [Hooks reference](https://code.claude.com/docs/en/hooks): every event, input schema and output field
- [Loop Engineering with Claude Code](/blog/claude-code-loop-engineering): using Stop hooks, `/goal` and `/loop` to keep Claude working until the job is done
- [Claude Skills: Build Your Own and Use the Best](/blog/claude-skills-guide): the instruction side of extending Claude Code
