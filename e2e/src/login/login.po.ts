import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login'); // Adjust the URL if needed
  }

  getLoginForm() {
    return element(by.css('app-login form')); // Adjust the CSS selector if needed
  }

  setEmail(email: string) {
    const emailInput = element(by.css('app-login form input[name="email"]'));
    emailInput.sendKeys(email);
  }

  setPassword(password: string) {
    const passwordInput = element(by.css('app-login form input[name="pwd"]'));
    passwordInput.sendKeys(password);
  }

  submitLoginForm() {
    const submitButton = element(by.css('app-login form button[type="submit"]'));
    submitButton.click();
  }

  getLoggedInUsername() {
    return element(by.css('.logged-in-username')).getText(); // Adjust the CSS selector if needed
  }

  getErrorMessage() {
    return element(by.css('.error-message')).getText(); // Adjust the CSS selector if needed
  }
}
