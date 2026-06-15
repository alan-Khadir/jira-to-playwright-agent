import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import {CustomWorld} from '../support/world';

Given('a user is on the Home page', async function (this:CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    const homePage = new HomePage(this.page);
    await homePage.goTo();
});

When('the user clicks on the {string} button', async function (this: CustomWorld, buttonText: string) {
    if (!this.page) throw new Error('Page not initialised');
    const homePage = new HomePage(this.page);

    if (buttonText === 'Sign In') {
        await Promise.all([
            this.page.waitForURL(/(?:\/html)?\/signin(?:\.html)?$/),
            homePage.clickSignIn(),
        ]);
    } else if (buttonText === 'Create Account') {
        await Promise.all([
            this.page.waitForURL(/(?:\/html)?\/create-account(?:\.html)?$/),
            homePage.clickCreateAccount(),
        ]);
    } else {
        throw new Error(`Unknown button text: ${buttonText}`);
    }
});

Then('the user should be taken to the Sign In page', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    await expect(this.page).toHaveURL(/(?:\/html)?\/signin(?:\.html)?$/);
    await expect(this.page.locator('h1')).toHaveText('Sign In');
});

Then('the user should be taken to the Create Account page', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialised');
    await expect(this.page).toHaveURL(/(?:\/html)?\/create-account(?:\.html)?$/);
    await expect(this.page.locator('h1')).toHaveText('Create Account');
});