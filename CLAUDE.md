# Simmer — Agent Instructions

## Deny list

- Do NOT read, write, modify, or print the contents of `.env`, `.env.local`, or any `.env.*` file.
- Do NOT commit or push to any remote without explicit user confirmation for that specific action.
- Do NOT run `git push --force` under any circumstances.
- Do NOT hardcode secrets, API keys, tokens, or connection strings in any source file — always use `process.env`.
- Do NOT use the Supabase MCP tools `apply_migration`, `reset_branch`, `delete_branch`, or `pause_project` without the user explicitly approving the specific operation first.
- Do NOT run `npm publish`, `gh release create`, or any action that publishes or deploys on the user's behalf without confirmation.
- Do NOT run the seed script (`scripts/seed.mjs`) against production without explicit user instruction.
