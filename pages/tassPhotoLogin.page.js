const { expect } = require('@playwright/test');

const username = 'support@nutnet.ru';
const password = 'tassphoto_admin';

exports.tassPhotoLoginPage = class tassPhotoLoginPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginField = page.locator('input#email');
    this.passwordField = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('http://admin.tassphoto.dev.itass.local/login');
  }

  async login() {
    await this.loginField.type(username);
    await this.page.pause();
    await this.passwordField.type(password);
    await this.submitButton.click();
  }
}
