# AI Website Repair Starter Kit

This is a starter kit, NOT a complete website. Copy its contents into the ROOT of one exported website project (alongside that project's package.json). Keep a separate backup of the original export ZIP.

IMPORTANT: If the website already contains `.gitignore`, `AGENTS.md`, or `CLAUDE.md`, MERGE these instructions rather than overwriting existing project content. Do not overwrite existing package.json, source code, or environment settings.

## Windows 11 usage
1. Install VS Code, Node.js (the version compatible with the repo), Git, Codex and Claude Code.
2. Open the exported website folder in VS Code.
3. Confirm that the project is using npm, pnpm, yarn, bun, or another tool via package.json and existing lockfiles.
4. Put these rules at the project root, and inspect `.gitignore` for secrets and generated output.
5. Create a local Git baseline/checkpoint and a new repair branch before making changes. Review staged files for secrets before every commit.
6. Launch `codex` OR `claude` from the project directory. Do not have both agents modify the same files at the same time.
7. Paste FIRST_PROMPT.txt. Let the agent identify install/run/build commands instead of guessing.
8. Review README_LOCAL_SETUP.md and FIX_REPORT.md after the agent finishes.
9. Test locally first. Do not push to GitHub or connect production hosting until you approve.
