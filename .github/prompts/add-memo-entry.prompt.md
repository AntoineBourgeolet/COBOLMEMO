---
description: "Add a COBOL/JCL memo entry to MEMOCOBOL in the existing French style"
name: "Add Memo Entry"
argument-hint: "topic, category, or snippet to add"
agent: "agent"
---
Add a new memo entry for the user's requested topic.

Follow the project conventions in [workspace instructions](../copilot-instructions.md) and use [the data source](../../src/data/data.json) as the primary place to edit.

## Task
- Add or update **one** memo entry in `src/data/data.json`.
- Prefer an existing category unless the user explicitly asks for a new one.
- Preserve the current schema: `categories[]` with nested `items[]`.
- Keep the tone, labels, and explanations in **French**.
- Write practical, concise COBOL/JCL/z/OS examples.
- Include useful search tags and synonyms so the app search remains effective.
- Prefer content edits in the JSON file instead of hardcoding anything in React components.

## Entry quality checklist
Make sure the new item fits the existing pattern and includes:
- `id`
- `title`
- `content`
- `snippetTitle`
- `language`
- `codeSnippet`
- relevant `tags`

## Behavior
- If the request is ambiguous, ask **one short clarifying question** before editing.
- Keep naming and formatting aligned with nearby entries.
- Do not translate the full app or redesign the UI unless explicitly asked.

## Response format
After the edit, return a brief summary with:
1. the category updated,
2. the new memo title,
3. the main tags added,
4. any validation performed.