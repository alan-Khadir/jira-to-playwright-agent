# Prompt Templates Reference

Ready-to-use prompt templates for common automation tasks. Pick the template that matches your task, change the ticket number and details, and paste into VS Code Agent mode.

---

## A. Standard Automation

### From a Jira Ticket (Default — Semantic Locators)
```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Run in Demo Presentation Mode (milestone narration enabled).
Use npm run test:bdd:demo.
```

### From a Jira Ticket (CI Mode — No Browser Open)
```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Use npm run test:bdd.
```

### From a Jira Ticket (With Test ID Enrichment)
```
Automate the complete end-to-end framework assets for Jira ticket SCRUM-5.
Add test IDs to the application code where needed and reference them in page objects.
Run in Demo Presentation Mode (milestone narration enabled).
Use npm run test:bdd:demo.
```

### From a Description (No Jira Ticket)
```
Automate the login flow: user enters valid credentials, submits the form, and is redirected to the dashboard with a welcome message.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

---

## B. Locator Strategy Overrides

### Use Only Semantic Locators (No Test IDs At All)
```
Automate Jira ticket SCRUM-8.
Use ONLY getByRole and getByLabel locators — no test IDs allowed.
Use npm run test:bdd:demo.
```

### Use Only Role-Based Locators
```
Automate Jira ticket SCRUM-8.
Use ONLY getByRole locators for every element.
Use npm run test:bdd:demo.
```

### Force Test ID Mode
```
Automate Jira ticket SCRUM-8.
Add test IDs to every interactive element in the application code and use getByTestId for all locators in page objects.
Use npm run test:bdd:demo.
```

---

## C. Running Existing Tests

### Run All Tests (Demo Mode)
```
Run all existing BDD tests in demo mode.
Use npm run test:bdd:demo.
```

### Run All Tests (CI Mode)
```
Run all existing BDD tests.
Use npm run test:bdd.
```

### Run a Single Feature File
```
Run only the login-flows.feature file.
Use npm run test:bdd:demo.
```

### Run a Specific Scenario by Tag
```
Run only scenarios tagged @SCRUM-5.
Use npm run test:bdd:demo.
```

### Run Multiple Tags
```
Run all scenarios tagged @SCRUM-5 or @SCRUM-6.
Use npm run test:bdd:demo.
```

### Run Only Accessibility Tests
```
Run only scenarios tagged @accessibility.
Use npm run test:bdd:demo.
```

### Run Only Mobile Tests
```
Run only scenarios tagged @mobile.
Use npm run test:bdd:demo.
```

### Run Functional Tests Only (Exclude Accessibility and Mobile)
```
Run all scenarios not tagged @accessibility and not tagged @mobile.
Use npm run test:bdd:demo.
```

---

## D. Modifying Existing Tests

### Add a New Scenario to an Existing Feature
```
Add a new scenario to login-flows.feature for "User sees error toast on invalid login".
Jira ticket: SCRUM-12.
Use npm run test:bdd:demo.
```

### Add Multiple Scenarios to an Existing Feature
```
Add these scenarios to navigation-flows.feature:
1. User clicks a topic link and sees the dashboard with topic content loaded.
2. User clicks the logo and is redirected to the home page.
3. User clicks Task Board and sees the drag-and-drop board.
Jira ticket: SCRUM-15.
Use npm run test:bdd:demo.
```

### Update an Existing Scenario
```
Update the scenario "User logs in with valid credentials" in login-flows.feature.
The acceptance criteria changed — after login the user should now see a welcome toast notification in addition to the dashboard redirect.
Jira ticket: SCRUM-5.
Use npm run test:bdd:demo.
```

### Remove a Scenario
```
Remove the scenario "User sees legacy login popup" from login-flows.feature — this feature has been deprecated.
Jira ticket: SCRUM-20.
Use npm run test:bdd:demo.
```

---

## E. Fixing & Debugging

### Fix a Failing Test
```
The scenario "User logs in with valid credentials" in login-flows.feature is failing.
Diagnose the failure, fix it, and re-run.
Use npm run test:bdd:demo.
```

### Fix All Failing Tests
```
Run all BDD tests. For any scenario that fails, diagnose the root cause, fix it, and re-run until all scenarios pass.
Use npm run test:bdd:demo.
```

### Fix a Specific Locator Issue
```
The scenario "User submits the contact form" is failing because the Submit button locator is broken.
The button text was changed from "Submit" to "Send Message" in the latest app update.
Update the page object locator and re-run.
Use npm run test:bdd:demo.
```

### Diagnose Without Fixing
```
Run all BDD tests and report which scenarios are failing and why. Do NOT fix anything — just provide a diagnostic report.
Use npm run test:bdd.
```

---

## F. Coverage & Review

### Check Existing Coverage for a Jira Ticket
```
Check if Jira ticket SCRUM-10 already has test coverage in the existing feature files.
List all related scenarios and their current pass/fail status.
Do not create new tests.
```

### Review Coverage Gaps
```
Review all existing feature files in tests/features/ and identify which user flows are NOT covered yet.
Compare against the acceptance criteria in Jira tickets SCRUM-1 through SCRUM-15.
Provide a coverage gap report — do not create new tests.
```

### List All Existing Scenarios
```
List all existing BDD scenarios across all feature files.
Show: feature file name, scenario title, tags, and step count for each.
```

---

## G. Multi-Flow & Complex Scenarios

### Automate an End-to-End User Journey Spanning Multiple Pages
```
Automate the complete user journey:
1. User signs up with a new account on create-account.html.
2. User is redirected to signin.html and logs in with the new credentials.
3. User lands on the dashboard, clicks "Space Exploration" topic.
4. User completes the quiz and earns points.
5. User sees updated score in the header.
Jira ticket: SCRUM-25.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Automate a Form Validation Flow
```
Automate all form validation scenarios for the "Contribute a Fact" form on the form component topic:
1. Submit with all fields empty — expect inline error messages.
2. Submit with invalid email — expect email validation error.
3. Submit with valid data — expect success toast and fact appears in community section.
4. Upload an image file — expect filename and preview to appear.
5. Upload a non-image file — expect rejection.
Jira ticket: SCRUM-30.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Automate Drag and Drop
```
Automate the Task Board drag-and-drop flow:
1. User opens taskboard.html.
2. User drags a card from "To Learn" to "In Progress".
3. Card appears in the "In Progress" column.
4. User refreshes the page — card persists in "In Progress" (localStorage).
Jira ticket: SCRUM-35.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Automate Dark Mode Toggle
```
Automate the dark mode toggle:
1. User clicks the moon icon — page switches to dark mode.
2. User refreshes — dark mode persists (localStorage).
3. User clicks the sun icon — page switches back to light mode.
Jira ticket: SCRUM-40.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Automate Responsive / Mobile Menu
```
Automate the mobile hamburger menu at 768px viewport:
1. Set viewport to 375x812 (mobile).
2. Verify hamburger menu button is visible.
3. Click hamburger — nav items slide down.
4. Click a topic link — navigates correctly.
5. Click hamburger again — menu closes.
Jira ticket: SCRUM-45.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

---

## H. Accessibility Testing

### axe-core Full Page Scan
```
Automate an accessibility scan for the login page:
1. Navigate to the sign in page.
2. Run a full axe-core accessibility scan.
3. Assert zero violations.
Jira ticket: SCRUM-50.
Use npm run test:bdd:demo.
```

### axe-core Scoped Scan
```
Automate an accessibility scan for the dashboard navigation section only:
1. Log in and navigate to the dashboard.
2. Run an axe-core scan scoped to the navigation element.
3. Assert zero violations.
Jira ticket: SCRUM-51.
Use npm run test:bdd:demo.
```

### Verify ARIA Attributes
```
Automate accessibility checks for the tabs component:
1. Verify tab buttons have role="tab".
2. Verify tab panels have role="tabpanel".
3. Verify active tab has aria-selected="true".
4. Verify Arrow Left/Right keyboard navigation switches tabs.
5. Verify the correct tabpanel is visible when each tab is selected.
Jira ticket: SCRUM-52.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Verify Keyboard Navigation
```
Automate keyboard-only navigation for the login page:
1. User tabs to email input — focus ring visible.
2. User tabs to password input — focus ring visible.
3. User tabs to Submit button — focus ring visible.
4. User presses Enter on Submit — form submits.
Jira ticket: SCRUM-55.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### ARIA Snapshot Regression Test
```
Automate an ARIA snapshot test for the login form:
1. Navigate to the sign in page.
2. Capture the accessibility tree snapshot of the login form.
3. Assert the snapshot matches the stored baseline.
Jira ticket: SCRUM-56.
Use npm run test:bdd:demo.
```

---

## I. Batch & Bulk Operations

### Automate Multiple Jira Tickets in One Session
```
Automate end-to-end framework assets for these Jira tickets in order:
1. SCRUM-5 (Login flow)
2. SCRUM-6 (Sign-up flow)
3. SCRUM-7 (Navigation flow)
Run each as a separate feature file.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Re-run and Validate All Tests After App Changes
```
The application UI was updated. Re-run all existing BDD tests.
For any failures caused by changed UI elements, update the page object locators to match the new UI.
Do NOT change the Gherkin scenarios — only fix locators and step definitions.
Use npm run test:bdd:demo.
```

### Fix a Specific Failing Scenario (Demo Mode)
```
The scenario "User signs in with valid credentials" in login-flows.feature is failing.
Diagnose the failure, fix it, and re-run.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

### Fix All Failing Scenarios Automatically (Demo Mode)
```
Run all BDD tests. For any scenario that fails, diagnose the root cause, fix it, and re-run until all scenarios pass.
Run in Demo Presentation Mode.
Use npm run test:bdd:demo.
```

---

## J. Quick Reference — Which Template Do I Use?

| I want to... | Section | Template starts with... |
|---|---|---|
| Automate a Jira ticket | A | "Automate the complete end-to-end framework assets for Jira ticket..." |
| Automate without a Jira ticket | A | "Automate the login flow: user enters valid credentials..." |
| Automate AND add test IDs to the app | A | "...Add test IDs to the application code where needed..." |
| Force a specific locator strategy | B | "Use ONLY getByRole..." or "Add test IDs to every interactive element..." |
| Run existing tests | C | "Run all existing BDD tests..." or "Run only the X.feature file..." |
| Run tests by tag | C | "Run only scenarios tagged @SCRUM-X..." |
| Run only accessibility tests | C | "Run only scenarios tagged @accessibility" |
| Run only mobile tests | C | "Run only scenarios tagged @mobile" |
| Run functional tests only (no a11y/mobile) | C | "Run scenarios not tagged @accessibility and not @mobile" |
| Add a new scenario to an existing file | D | "Add a new scenario to X.feature for..." |
| Update an existing scenario | D | "Update the scenario X in Y.feature..." |
| Fix a broken test | E | "The scenario X is failing. Diagnose the failure, fix it..." |
| Fix all broken tests | E | "Run all BDD tests. For any scenario that fails..." |
| Just diagnose without fixing | E | "...Do NOT fix anything — just provide a diagnostic report." |
| Check what's already covered | F | "Check if Jira ticket SCRUM-X already has test coverage..." |
| Find coverage gaps | F | "Review all existing feature files and identify which flows are NOT covered..." |
| Automate a multi-page user journey | G | "Automate the complete user journey: 1. User signs up..." |
| Automate form validation | G | "Automate all form validation scenarios for..." |
| Automate drag and drop | G | "Automate the Task Board drag-and-drop flow..." |
| Automate dark mode | G | "Automate the dark mode toggle..." |
| Automate mobile/responsive | G | "Automate the mobile hamburger menu at 768px viewport..." |
| Run accessibility scan (full page) | H | "Automate an accessibility scan for the login page..." |
| Run accessibility scan (scoped) | H | "Automate an accessibility scan for the dashboard navigation section only..." |
| Test ARIA attributes | H | "Automate accessibility checks for the X component..." |
| Test keyboard navigation | H | "Automate keyboard-only navigation for..." |
| Test ARIA snapshot regression | H | "Automate an ARIA snapshot test for the login form..." |
| Automate multiple tickets at once | I | "Automate end-to-end framework assets for these Jira tickets in order..." |
| Re-validate tests after app UI changed | I | "The application UI was updated. Re-run all existing BDD tests..." |