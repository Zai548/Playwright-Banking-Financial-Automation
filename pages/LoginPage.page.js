import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.username = page.getByPlaceholder("Enter your username");
    this.password = page.getByPlaceholder("Enter your password");
    this.loginButton = page.getByTestId("login-button");
    this.showPasswordButton = page.getByTestId("toggle-password-btn");
    this.clearButton = page.getByTestId("clear-button");
    this.rememberCheckbox = page.getByTestId("remember-checkbox");
    this.pageTitle = page.getByText("Welcome to SecureBank");
    this.pageSubHead = page.getByText(
      "Your premier automation testing practice ground. Master complex UI interactions, state management, and end-to-end testing scenarios.",
    );
    this.formTitle = page.getByText("SecureBank Demo");
    this.formSubHead = page.getByText(
      "Automation Testing Practice Application",
    );

    //Error Messages
    this.usernameError = page.getByTestId("username-error");
    this.passwordError = page.getByTestId("Password is required");
    this.loginError = page.getByTestId("login-alert");
  }

  //Test actions
  //Go to the login page
  async goto() {
    await this.page.goto("https://qaplayground.com/bank");
  }

  //Login to the website
  async fillUpFields(username, password) {
    await this.username.click();
    await this.page.keyboard.type(username);
    await this.password.click();
    await this.page.keyboard.type(password);
  }

  //Press login button
  async login() {
    await this.loginButton.click();
  }

  //Press enter while in password field
  async pressEnter() {
    await this.password.click();
    await this.page.keyboard.press("Enter");
  }

  //Assertions
  //Check if the user is in the right page
  async expectLoginPage() {
    await expect(this.page).toHaveURL("https://qaplayground.com/bank");
  }

  //Check if the login page loads successfully
  async expectLoginPageLoadSuccessfully() {
    //Check if the page title and subheadline is visible
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageSubHead).toBeVisible();

    //Check if the form title and subhead is visible
    await expect(this.formTitle).toBeVisible();
    await expect(this.formSubHead).toBeVisible();

    //Check if the form fields and buttons is visible
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
    await expect(this.showPasswordButton).toBeVisible();
    await expect(this.rememberCheckbox).toBeVisible();
  }

  //Checks the login alert
  async expectLoginAlert() {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText("Invalid username or password");
  }

  //Checks if the password toggle button hides and shows the password
  async expectPasswordToggle() {
    await expect(this.password).toHaveAttribute("type", "password");

    await this.showPasswordButton.click();
    await expect(this.password).toHaveAttribute("type", "text");

    await this.showPasswordButton.click();
    await expect(this.password).toHaveAttribute("type", "password");
  }
}
