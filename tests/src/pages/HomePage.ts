import type { Page} from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly signInButton = 'button[data-testid="sign-in-button"]';
    readonly createAccountButton = 'button[data-testid="create-account-button"]';

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto('http://localhost:3000/html/index.html');
    }

    async clickSignIn() {
        await this.page.click(this.signInButton);
    }
    
    async clickCreateAccount() {
        await this.page.click(this.createAccountButton);
    }
}