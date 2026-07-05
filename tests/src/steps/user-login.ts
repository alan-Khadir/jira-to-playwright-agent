import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CustomWorld } from '../support/world';

Given('a user is on the Sign In page', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    const signInPage = new SignInPage(this.page);
    await signInPage.goTo();
});

When('the user enters {string} into the email field', async function (this: CustomWorld, email: string) {
    if (!this.page) throw new Error('Page is not initialised');
    const signInPage = new SignInPage(this.page);
    await signInPage.enterEmail(email);
});

When('the user enters {string} into the password field', async function (this: CustomWorld, password: string) {
    if (!this.page) throw new Error('Page is not initialised');
    const signInPage = new SignInPage(this.page);
    await signInPage.enterPassword(password);
});

When('the user clicks the sign in submit button', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    const signInPage = new SignInPage(this.page);
    await Promise.all([
        this.page.waitForURL(/(?:\/html)?\/dashboard(?:\.html)?$/),
        signInPage.clickSubmit(),
    ]);
});

Then('the user should be redirected to the dashboard page', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    await expect(this.page).toHaveURL(/(?:\/html)?\/dashboard(?:\.html)?$/);
    await expect(this.page.locator('h1')).toHaveText('Dashboard');
    const dashboardPage = new DashboardPage(this.page);
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toBe('Welcome back!');
});
