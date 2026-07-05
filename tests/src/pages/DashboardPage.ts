import type { Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly welcomeMessage = '[data-testid="dashboard-welcome"]';

    constructor(page: Page) {
        this.page = page;
    }

    async getWelcomeText() {
        return this.page.textContent(this.welcomeMessage);
    }
}
