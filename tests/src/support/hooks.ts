import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

setDefaultTimeout(60 * 1000);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
    this.page = null;
  }

  if (this.context) {
    await this.context.close();
    this.context = null;
  }

  if (this.browser) {
    await this.browser.close();
    this.browser = null;
  }
});
