# 🎭 Jira to Playwright Agent
## Dual-Server Agentic Orchestration Layer for Autonomous Test Generation

### Architecture Overview

This repository demonstrates **advanced AI-driven test automation** using a dual-server MCP orchestration layer. The framework enables autonomous end-to-end test generation directly from Jira tickets, with no manual locator guessing, no boilerplate repetition, and complete self-healing error recovery.

**Key Innovation**: Declarative automation commands like `"Automate the complete end-to-end framework assets for Jira ticket SCRUM-5"` trigger autonomous workflows that:
1. Extract functional requirements from Jira
2. Explore the live web app via Playwright MCP for dynamic DOM discovery
3. Generate Page Objects, Gherkin features, and step definitions
4. Execute tests and self-heal on compilation errors
5. Document complete traceability between Jira and framework assets

### Central Constraints & Orchestration

**Global Framework Standards**: [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
- Defines Principal QA Automation Engineer persona within VS Code
- Enforces Page Object Model, Gherkin naming, and Jira tagging standards
- Implements autonomous multi-server loop (Jira MCP + Playwright MCP)
- Enables self-healing error recovery and autonomous defect correction

**Dual-Server MCP Configuration**: [`.vscode/mcp.json`](.vscode/mcp.json)
- **Atlassian Server** (`@sooperset/mcp-atlassian`): Jira requirement extraction
- **Playwright Server** (`@playwright/mcp`): Dynamic DOM analysis and locator discovery
- Both servers execute inside Docker containers for security and session isolation

### Tech Stack

- **Test Framework**: Playwright with TypeScript
- **BDD Layer**: Cucumber with Gherkin scenarios
- **Page Objects**: TypeScript classes with readonly locators mapped to `data-testid`
- **Requirements**: Jira MCP server for live ticket querying
- **DOM Discovery**: Playwright MCP for autonomous element locator extraction
- **Orchestration**: VS Code Copilot Agent with self-healing loop

### Quick Start

#### Prerequisites
- **Node.js** v18+
- **Docker Desktop** (must be running; required for MCP servers)
- **VS Code** with GitHub Copilot extension

#### Step 1: Install Project Dependencies

```bash
cd tests
npm install
```

This caches all dependencies locally before initializing MCP server channels.

#### Step 2: Set Up MCP Servers (One-Time)

1. Ensure **Docker Desktop is running** (open from applications menu or system tray)
2. Create `jira-mcp.env` in the repository root with your Jira credentials (see [`docs/setup-guide.md`](docs/setup-guide.md))
3. In VS Code, open the **MCP Panel** (status bar or Command Palette)
4. **Start** the `@sooperset/mcp-atlassian` server (for Jira integration)
5. **Start** the `@playwright/mcp` server (for DOM exploration)
6. Reload the window: `Ctrl+Shift+P` → `Developer: Reload Window`

#### Step 3: Run the Webapp & Tests

**Terminal 1** — Start the web app:
```bash
cd webapp
npx serve .
# App available at http://localhost:3000/html/index.html
```

**Terminal 2** — Run tests:
```bash
cd tests
npm run test:bdd
```

#### Step 4: Autonomous Test Generation (Advanced)

With your MCP servers running, open **VS Code Copilot Chat (Agent Mode)** and choose one of the options below to run the pipeline:

##### Option A: Live Jira Integration (Full Dual-MCP Loop)
If you have configured your Atlassian credentials and set up the blueprint ticket on your board (see the exact ticket layout in [`docs/setup-guide.md`](docs/setup-guide.md)), type:
```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
```

##### Option B: Instant Local Sandbox (No Jira Required)
If you want to test the framework's autonomous generation, locator discovery, and self-healing engine instantly without setting up a Jira account, type:
```
Bypass Jira and automate a brand new end-to-end negative test scenario called 'User fails to sign in with invalid credentials'. Use Playwright MCP to scan signin.html for the correct locators, generate the new test assets, and run test:bdd to validate it.
```

Whichever option you choose, the agent will autonomously:
- Query Jira for the ticket requirements (or parse your local prompt instructions)
- Explore the live app and discover element locators via Playwright MCP
- Generate feature files, Page Objects, and step definitions
- Execute tests and validate the entire suite
- Document complete traceability in `docs/SCRUM-5-implementation.md` (or your local equivalent)

> ⚠️ **Important Note:** This repository is intentionally delivered as a **clean-slate template** with no pre-existing test files in the primary branch. This ensures that whichever command you run above, you will get to see the agent dynamically inspect the DOM, write the code, and run the self-healing loops entirely from scratch!

### Debugging & Troubleshooting

**Default Browser Execution**: The test suite runs in **headed mode by default** (`headless: false` in `tests/src/support/hooks.ts`), so you will see the browser UI during test execution.

**Interactive Step Debugging**:
```powershell
$env:PWDEBUG = '1'
cd tests
npm run test:bdd
```
This opens the Playwright Inspector side-by-side with the browser for interactive stepping and DOM inspection.

**Playwright VS Code Extension**:
Use the [Playwright VS Code Extension](https://playwright.dev/docs/getting-started-vscode) to create, run, trace, and debug tests visually with the test explorer.

### Documentation & Architecture

- **Full Project Plan**: [docs/project-plan.md](docs/project-plan.md) — chronological assembly log and Phase 7 agentic orchestration details
- **Setup Guide**: [docs/setup-guide.md](docs/setup-guide.md) — environment configuration and troubleshooting
- **Example Automation Report**: [docs/SCRUM-5-implementation.md](docs/SCRUM-5-implementation.md) — SCRUM-5 autonomous test generation artifacts and traceability
- **Global Constraints**: [.github/copilot-instructions.md](.github/copilot-instructions.md) — Principal QA Engineer persona and framework standards

## License

This project is licensed under the AGPL-3.0 License — see the LICENSE file for details.
