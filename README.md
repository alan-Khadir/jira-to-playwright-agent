# 🎭 Jira to Playwright Agent
## Dual-Server Agentic Orchestration Layer for Autonomous Test Generation

### What Is This?

This framework enables **autonomous end-to-end test generation** directly from Jira tickets using a dual-server MCP orchestration layer. Declarative commands like `"Automate the complete end-to-end framework assets for Jira ticket SCRUM-5"` trigger workflows that extract requirements, explore the live app, generate test assets, and self-heal on failures — with no manual locator guessing or boilerplate repetition.

### Architecture Overview

**Key Innovation**: The agent autonomously:
1. Extracts functional requirements from Jira via the Atlassian MCP server
2. Explores the live web app via Playwright MCP for dynamic DOM discovery
3. Generates Page Objects with semantic locators following Playwright's recommended 7-level priority (getByRole → getByLabel → getByPlaceholder → getByText → getByAltText → getByTitle → getByTestId as fallback)
4. Generates Gherkin features and step definitions
5. Executes tests and self-heals on compilation errors
6. Documents complete traceability between Jira and framework assets

**Central Constraints & Orchestration**

- **Global Framework Standards**: [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — Principal QA Automation Engineer persona, locator strategy, Page Object Model standards, self-healing loop, and demo presentation mode
- **Dual-Server MCP Configuration**: [`.vscode/mcp.json`](.vscode/mcp.json) — Atlassian server for Jira requirement extraction + Playwright server for dynamic DOM analysis, both running inside Docker containers

### Tech Stack

- **Test Framework**: Playwright with TypeScript
- **BDD Layer**: Cucumber with Gherkin scenarios
- **Page Objects**: TypeScript classes with semantic locators following Playwright's official priority (see [Locator Strategy](.github/copilot-instructions.md#b-locator-strategy))
- **Requirements**: Jira MCP server for live ticket querying
- **DOM Discovery**: Playwright MCP for autonomous element locator extraction
- **Orchestration**: VS Code Copilot Agent with self-healing loop

### Project Structure

```
jira-to-playwright-agent/
├── .github/
│   └── copilot-instructions.md    # Agent steering file (Sections 1-6)
├── .vscode/
│   └── mcp.json                   # Dual-server MCP configuration
├── docs/
│   ├── setup-guide.md             # Full setup & configuration guide
│   ├── project-plan.md            # Chronological assembly log
│   └── SCRUM-5-implementation.md  # Example automation report
├── tests/
│   ├── features/                  # Gherkin .feature files
│   ├── src/
│   │   ├── pages/                 # Page Object Model classes
│   │   ├── steps/                 # Step definition files
│   │   └── support/               # Hooks, world, config
│   └── reports/                   # Generated HTML reports
├── webapp/
│   ├── html/                      # Application HTML pages
│   ├── js/                        # Application JavaScript
│   ├── css/                       # Application styles
│   └── data/                      # Application data (topics.json)
├── .gitignore
├── jira-mcp.env                   # Jira credentials (NOT committed)
└── README.md
```

### Quick Start

1. **Install dependencies**: `cd tests && npm install`
2. **Start the webapp**: `cd webapp && npx serve .`
3. **Run tests**: `cd tests && npm run test:bdd:demo`
4. **Full MCP setup** (Jira + Playwright servers): see [Setup Guide](docs/setup-guide.md)

> ⚠️ This repository is intentionally delivered as a **clean-slate template**. The agent dynamically inspects the DOM, writes test code, and runs self-healing loops entirely from scratch.

### Using the Agent

With MCP servers running, open **VS Code Copilot Chat (Agent Mode)** and issue a declarative prompt:

```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Run in Demo Presentation Mode (milestone narration enabled).
Use npm run test:bdd:demo.
```

The agent will autonomously extract requirements from Jira, explore the live app for locators, generate feature files, Page Objects, and step definitions, then execute and validate the test suite.

For all available prompt templates (running tests, fixing failures, accessibility testing, batch operations, and more), see [Prompt Templates File](docs/prompt-templates.md) or the [Prompt Examples section in the Setup Guide](docs/setup-guide.md#-prompt-examples).

### Demo Presentation Mode

The agent supports a narration-friendly logging mode for video demos. Add "Demo Presentation Mode ON" to your prompt to enable structured milestone outputs. See [Setup Guide — Demo Presentation Mode](docs/setup-guide.md#-demo-presentation-mode-optional) for details and examples.

### Command Reference

For the full command reference, see [Setup Guide — Command Reference](docs/setup-guide.md#️-command-reference).

### Debugging & Troubleshooting

For debugging tips (headed mode, Playwright Inspector, VS Code extension), see [Setup Guide — Debugging](docs/setup-guide.md#-interactive-test-debugging).

### Documentation

- **Setup Guide**: [docs/setup-guide.md](docs/setup-guide.md) — environment configuration, commands, and troubleshooting
- **Steering File**: [.github/copilot-instructions.md](.github/copilot-instructions.md) — Principal QA Engineer persona, locator strategy, and 30+ prompt templates

## License

This project is licensed under the AGPL-3.0 License — see the LICENSE file for details.
