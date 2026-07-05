import type { Page } from '@playwright/test';

export class SignInPage {
    readonly page: Page;
    readonly emailInput = '[data-testid="email-input"]';
    readonly passwordInput = '[data-testid="password-input"]';
    readonly submitButton = '[data-testid="submit-signin"]';

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

    async clickSubmit() {
        await this.page.click(this.submitButton);
    }
}
