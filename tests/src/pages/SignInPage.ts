import type { Page } from '@playwright/test';

export class SignInPage {
    readonly page: Page;
    readonly emailInput = '[data-testid="email-input"]';
    readonly passwordInput = '[data-testid="password-input"]';
    readonly submitButton = '[data-testid="submit-signin"]';
    readonly dashboardWelcome = '[data-testid="dashboard-welcome"]';

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto('http://localhost:3000/html/signin.html');
    }

    async enterEmail(email: string) {
        await this.page.fill(this.emailInput, email);
    }

    async enterPassword(password: string) {
        await this.page.fill(this.passwordInput, password);
    }

    async clickSignInButton() {
        await this.page.click(this.submitButton);
    }

    async isOnDashboard() {
        return await this.page.waitForSelector(this.dashboardWelcome, { timeout: 5000 }).then(() => true).catch(() => false);
    }

    async fillAndSubmitSignIn(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSignInButton();
    }
}
