# Setup Guide

This guide explains how to start the local webapp, install dependencies, and run the Playwright BDD tests.

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later)
- npm
- Git
- Python (optional, only if you want to use `python -m http.server` instead of `serve`)

## Install dependencies

Open a terminal at the repository root:

```bash
cd .
```

Install project dependencies for the `tests` folder:

```bash
cd tests
npm install
```

## Start the webapp

Open a second terminal and start the static webapp server from the `webapp` folder.

If you have `serve` installed globally:

```bash
cd webapp
npx serve@latest .
```

If `serve` is not installed, install it once:

```bash
npm install -g serve
cd webapp
serve .
```

Alternatively, use Python's built-in server:

```bash
cd webapp
python -m http.server 3000
```

The app should now be available at:

```text
http://localhost:3000/html/index.html
```

## Run the Playwright BDD tests

With the webapp server running, open another terminal and run:

```bash
cd tests
npm run test:bdd
```

## Configure the Dual-Server MCP Integration

### Prerequisites

1. **Docker Desktop** must be running at all times (open from applications menu or system tray)
2. Both MCP servers are pre-configured in `.vscode/mcp.json` and execute inside Docker containers

### Initialize MCP Servers (One-Time Setup)

1. In VS Code, open the **MCP Panel** via:
   - The status bar icon, OR
   - Command Palette: `Ctrl+Shift+P` → "MCP"

2. For each server, click **Start**:
   - `@sooperset/mcp-atlassian` (Jira integration)
   - `@playwright/mcp` (Dynamic DOM exploration)

3. **Reload the workspace** to synchronize environment pipes:
   - `Ctrl+Shift+P` → `Developer: Reload Window`
   - Wait for VS Code to restart and MCP servers to reconnect

### Jira MCP Configuration

Create a `jira-mcp.env` file in the repository root with your Jira credentials:

```text
JIRA_URL=https://your-company.atlassian.net
JIRA_USERNAME=you@company.com
JIRA_API_TOKEN=your_api_token
MCP_VERY_VERBOSE=true
```

**How It Works**:
- Your `.vscode/mcp.json` is configured with a `docker run` command
- When you start the Atlassian server via the MCP Panel, it launches a Docker container
- The container loads credentials from `jira-mcp.env` and exposes Jira query APIs
- Communication happens via process streams (no localhost ports exposed)
- Both servers run simultaneously for dual-layer automation

### Using the Servers

Once both servers are running and the window is reloaded:

**Jira Queries** (e.g., in VS Code Copilot Chat):
```
Show me all issues from project SCRUM
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5
```

**DOM Exploration** (automatic during test generation):
- The agent uses Playwright MCP to explore the live webapp
- It discovers and extracts exact `data-testid` attributes
- No manual locator guessing required

## Run tests with a visible browser

By default the Playwright test hooks launch Chromium in headless mode. To see the browser while tests run, use one of these options.

### Option 1: update hooks.ts

Edit `tests/src/support/hooks.ts` and change:

```ts
this.browser = await chromium.launch({ headless: true });
```

to:

```ts
this.browser = await chromium.launch({ headless: false });
```

### Option 2: use Playwright debug mode in PowerShell

In PowerShell, set the environment variable first and then run the tests:

```powershell
$env:PWDEBUG = '1'
cd tests
npm run test:bdd
```

This opens the Playwright browser and pauses on actions so you can inspect the flow.

### VS Code Extension

You can also use the Playwright VS Code Extension to create, run, and debug tests directly inside VS Code.
- Install the extension from the marketplace
- Open the workspace and use the Playwright test explorer
- This is especially useful for inspecting test failures and running individual scenarios

## What these commands do

- `npx serve .` starts a static file server from the `webapp` folder
- `npm install` installs the test dependencies in `tests/`
- `npm run test:bdd` starts Cucumber and runs your step definitions against the app

## Troubleshooting

- If the browser cannot connect to `http://localhost:3000`, make sure the webapp server is running.
- If the Playwright hooks timeout while launching Chromium, run:

```bash
cd tests
npx playwright install chromium
```

- If you are on PowerShell and want headed browser debugging, use:

```powershell
$env:PWDEBUG = '1'
npm run test:bdd
```

- If `serve` is not found, install it globally with `npm install -g serve` or use Python's `http.server`.

### 📋 Jira Ticket Configuration Blueprint (For SCRUM-5)

If you want to test the live Jira MCP integration, create a new story or task on your personal Atlassian Jira board with these exact details so the agent can parse it perfectly:

*   **Project Key:** SCRUM
*   **Issue ID/Key:** SCRUM-5
*   **Summary/Title:** User logs in successfully with valid credentials
*   **Description** (Copy and paste this exact Gherkin scenario into the description box):

```gherkin
Feature: User Sign In
  @SCRUM-5
  Scenario: User logs in successfully with valid credentials
    Given a user is on the Sign In page
    When the user enters "user@test.com" into the email field
    And the user enters "Password123" into the password field
    And the user clicks the sign in submit button
    Then the user should be redirected to the dashboard page
```

## Next steps

Once the tests run successfully, you can continue by:

- adding additional feature files to `tests/features/`
- expanding page objects under `tests/src/pages/`
- adding step definitions under `tests/src/steps/`
- documenting Jira and MCP configuration in `docs/jira-setup.md` and `docs/mcp-setup.md`
