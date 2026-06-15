import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';

export class CustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  baseURL: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
  }
}

setWorldConstructor(CustomWorld);
