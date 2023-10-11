import { LoginPage } from './login.po';

describe('Login Page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo(); // Assuming you have a navigateTo method in your LoginPage class
  });

  it('should display the login form', () => {
    expect(page.getLoginForm().isDisplayed()).toBeTruthy();
  });

  it('should fill in the login form and submit', () => {
    page.setEmail('test@example.com');
    page.setPassword('password');
    page.submitLoginForm();
  });

  it('should handle invalid login', () => {
    page.setEmail('invalid@example.com');
    page.setPassword('invalidpassword');
    page.submitLoginForm();
  });
});
