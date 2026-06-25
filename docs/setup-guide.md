# 🎯 Setup Guide

This guide explains how to start the local webapp, install dependencies, and run the Playwright BDD tests with the dual-server MCP configuration.

---

## 📋 Prerequisites

Make sure you have the following installed and running before starting:

- **Node.js** (v18 or later) & npm
- **Git**
- **VS Code** (with the GitHub Copilot extension active for Agent Mode)
- **Docker Desktop** (must be running in the background to host the MCP environment)

---

## 📦 Install Dependencies

**1.** Open your terminal at the repository root

**2.** Install the framework automation dependencies:

```bash
cd tests
npm install
```

---

## 🚀 Start the Webapp

**1.** Open a terminal and navigate to the webapp folder

**2.** Start the static webapp server using npx:

```bash
cd webapp
npx serve .
```

**3.** Verify the app is running locally at:

```
http://localhost:3000/html/index.html
```

---

## 🧪 Run the Playwright BDD Tests

**1.** With the webapp server running in your first terminal, open a second terminal

**2.** Navigate to the tests directory and execute the Cucumber BDD suite:

```bash
cd tests
npm run test:bdd
```

---

## 📊 Visual BDD Report for Demo

The framework supports visual HTML report generation for demos and presentations. The report is generated from Cucumber JSON output using `multiple-cucumber-html-reporter`.

**Run the full demo flow** (tests + HTML report + auto-open):

```bash
cd tests
npm run test:bdd:demo
```

This command executes all BDD scenarios, generates the HTML report at `reports/html/index.html`, and opens it in your default browser automatically.

**Generate the report separately** (without re-running tests):

```bash
npm run report:bdd
```

**Open the report manually** (cross-platform):

| Platform | Command |
|----------|---------|
| Windows  | `npm run report:open:win` |
| macOS    | `npm run report:open:mac` |
| Linux    | `npm run report:open:linux` |

> **Note:** `npm run test:bdd` remains CI-friendly and non-interactive — it does not generate or auto-open reports. Use `npm run test:bdd:demo` exclusively for demo recordings and presentations.

> **Default Execution Policy (Single-Run Rule):** In Agent Mode, the default execution command is `npm run test:bdd:demo`. The agent runs exactly one primary test command per automation cycle. Do not run both `npm run test:bdd` and `npm run test:bdd:demo` in the same cycle. If the user explicitly requests CI mode or explicitly says `npm run test:bdd`, the agent will run only that command without auto-opening the report.

---

## 🔧 Configure the Dual-Server MCP Integration

### Prerequisites

> ⚠️ **Important:** Docker Desktop must be running at all times (open from your applications menu or system tray).

- Both MCP servers are pre-configured in `.vscode/mcp.json`
- Servers automatically execute isolated inside Docker containers

### Initialize MCP Servers (One-Time Setup)

**1.** In VS Code, open the MCP Panel via the status bar icon or by running:

```
Ctrl+Shift+P → "MCP"
```

**2.** For each server, click **Start**:

- `@sooperset/mcp-atlassian` — Extracts live Jira ticket requirements
- `@playwright/mcp` — Handles dynamic DOM exploration and interactive locator mapping

**3.** Reload the workspace to synchronize environment pipes:

```
Ctrl+Shift+P → Developer: Reload Window
```

> ✅ **Status Check:** Wait for VS Code to refresh and show a green status for both MCP pipes.

---

## 🔐 Jira MCP Configuration

**1.** Create a `jira-mcp.env` file in your repository root directory

**2.** Add your Jira credentials:

```env
JIRA_URL=https://your-company.atlassian.net
JIRA_USERNAME=you@company.com
JIRA_API_TOKEN=your_api_token
MCP_VERY_VERBOSE=true
```

### How It Works

- Your `.vscode/mcp.json` maps configuration straight to an isolated Docker routine
- The container securely pulls credentials from `jira-mcp.env` and exposes Jira query APIs
- All agent interactions happen seamlessly via process streams without exposing vulnerable localhost ports

---

## 📋 Jira Ticket Configuration Blueprint

### For SCRUM-5 Verification

To evaluate the live agentic requirement-to-code cycle, create a mock ticket on your Jira board with these exact specifications before prompting the agent:

**Project Key:** `SCRUM`

**Issue ID/Key:** `SCRUM-5`

**Summary/Title:** `User logs in successfully with valid credentials`

**Description:** Paste this exact block into the description field:

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

---

## 🤖 Using the Servers

Once both servers are running, the window is reloaded, and your Jira ticket is configured:

**1.** Open VS Code Copilot Chat (Agent Mode)

**2.** Issue declarative automation prompts such as:

```
Show me all issues from project SCRUM
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5
```

**Result:** The agent will automatically:

- Pull requirements using the Jira MCP server
- Analyze the running webapp via the Playwright MCP server
- Map out exact `data-testid` attributes
- Construct compliant code completely from scratch

---

## 🐛 Interactive Test Debugging

The test suite runs in **headed mode by default** (`headless: false` in `tests/src/support/hooks.ts`), so you will see the browser UI during execution. Tests execute quickly with this configuration.

If a scenario is failing and you need to slow down execution, inspect the DOM, or step through automation line-by-line, use Playwright's built-in interactive debugger.

### Using the Debugger in Windows PowerShell

**1.** Open a Windows PowerShell terminal

**2.** Navigate to your test suite directory

**3.** Initialize the debug variable before executing tests:

```powershell
cd tests
$env:PWDEBUG = '1'
npm run test:bdd
```

**Result:** Playwright Inspector opens side-by-side with the browser, pauses execution at each step, and lets you visually debug the live workspace.

### VS Code Extension

You can also leverage the official **Playwright VS Code Extension** to run and trace tests visually:

**1.** Install the extension from the VS Code Marketplace

**2.** Open the test explorer sidebar to run individual scenarios

**3.** Audit trace logs and evaluate exact assertion failures

> 💡 **Pro Tip:** This is highly recommended for debugging complex test scenarios.

---

## 🛠️ Command Reference

| Command | Purpose |
|---------|---------|
| `npx serve .` | Starts a low-overhead static file server targeting your sandbox webapp folder |
| `npm install` | Provisions local node modules required to run TypeScript, Playwright, and Cucumber |
| `npm run test:bdd` | Runs the Cucumber BDD suite (CI-friendly, no report auto-open) |
| `npm run test:bdd:demo` | Runs BDD tests, generates HTML report at `reports/html/index.html`, and opens it automatically |
| `npm run report:bdd` | Generates the HTML report from the last Cucumber JSON output |
| `npm run report:open:win` | Opens the HTML report on Windows |
| `npm run report:open:mac` | Opens the HTML report on macOS |
| `npm run report:open:linux` | Opens the HTML report on Linux |

---

## 🎬 Demo Presentation Mode (Optional)

This mode enables structured, narration-friendly logging designed for recorded walkthroughs and video demonstrations. When active, the agent outputs clear milestone announcements suitable for voiceover narration.

### How to Request It

Add the activation flag directly in your prompt:

**Enable:**
```
Automate SCRUM-5 — Demo Presentation Mode ON.
```

**Disable:**
```
Automate SCRUM-5 — Demo Presentation Mode OFF.
```

### Execution Behavior

- Demo Presentation Mode ON/OFF only changes log verbosity — it does not affect which test command is executed.
- The default execution command remains `npm run test:bdd:demo` (tests + report + auto-open) regardless of mode, unless the user explicitly requests `npm run test:bdd`.

### Prompt Examples

```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Run in Demo Presentation Mode (milestone narration enabled).
Use npm run test:bdd:demo.
```

```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Run in Standard Mode (concise logs, no milestone narration).
Use npm run test:bdd:demo.
```

```
Automate SCRUM-5 — Demo Presentation Mode ON.
```

Demo Presentation Mode controls narration verbosity only; command execution remains `npm run test:bdd:demo` unless `npm run test:bdd` is explicitly requested.

### Quick Troubleshooting

| Situation | Action |
|-----------|--------|
| Logs are too verbose during normal work | Use "Demo Presentation Mode OFF." in your prompt |
| Recording a walkthrough or video demo | Use "Demo Presentation Mode ON." in your prompt |

---

## 🚨 Troubleshooting

### App Connection Failures

**Problem:** Browser cannot connect to `http://localhost:3000`

**Solution:** Ensure your first terminal is still running `npx serve .`

### Missing Chromium Binaries

**Problem:** Playwright hooks timeout while launching the browser engine

**Solution:** Explicitly pull down the system binaries by running:

```bash
cd tests
npx playwright install chromium
```

### PowerShell Windows Debugging

**Problem:** On native Windows PowerShell, headed browser tracking not working

**Solution:** Navigate to the folder before triggering the debug variable:

```powershell
cd tests
$env:PWDEBUG = '1'
npm run test:bdd
```

---

## 📚 Next Steps

Once your validation runs return green, you can build upon the framework by:

**1.** Creating custom feature files inside `tests/features/`

**2.** Mapping new UI patterns into reusable classes under `tests/src/pages/`

**3.** Writing lightweight, logic-free binding steps under `tests/src/steps/`