# 🎭 Playwright BDD Showcase
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
- **Playwright Server** (`@playwright/mcp@latest`): Dynamic DOM analysis and locator discovery
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
npx serve@latest .
# App available at http://localhost:3000/html/index.html
```

**Terminal 2** — Run tests:
```bash
cd tests
npm run test:bdd
```

#### Step 4: Autonomous Test Generation (Advanced)

With MCP servers running, use VS Code Copilot Chat and type:
```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5
```

The agent will autonomously:
- Query Jira for the ticket requirements
- Explore the live app and discover element locators
- Generate feature files, Page Objects, and step definitions
- Execute tests and validate the entire suite
- Document complete traceability in `docs/SCRUM-5-implementation.md`

### Debugging & Troubleshooting

**View Browser During Test Execution**:
```powershell
$env:PWDEBUG = '1'
cd tests
npm run test:bdd
```

**Update Hooks for Headed Browser** (always visible):
Edit `tests/src/support/hooks.ts` and change `headless: true` to `headless: false`.

**Playwright Inspector**:
Use the Playwright VS Code Extension to create, run, and debug tests interactively. See [Playwright VS Code Docs](https://playwright.dev/docs/getting-started-vscode).

### Documentation & Architecture

- **Full Project Plan**: [docs/project-plan.md](docs/project-plan.md) — chronological assembly log and Phase 7 agentic orchestration details
- **Setup Guide**: [docs/setup-guide.md](docs/setup-guide.md) — environment configuration and troubleshooting
- **Example Automation Report**: [docs/SCRUM-5-implementation.md](docs/SCRUM-5-implementation.md) — SCRUM-5 autonomous test generation artifacts and traceability
- **Global Constraints**: [.github/copilot-instructions.md](.github/copilot-instructions.md) — Principal QA Engineer persona and framework standards
