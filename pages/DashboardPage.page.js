import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageTitle = page.getByTestId("page-title");
    this.viewerBadge = page.getByTestId("viewer-badge");
    this.roleIndicator = page.getByTestId("role-indicator");
    this.addAccountButton = page.getByTestId("quick-add-account");
  }

  //Assertions
  //Check if the dashboard page loads successfully
  async expectDashboardLoadSuccessfully() {
    //Check if the user goes to the right page
    await expect(this.page).toHaveURL(
      "https://qaplayground.com/bank/dashboard",
    );

    //Check if the page title has a Dashboard text
    const pageTitleText = await this.pageTitle.allTextContents();
    await expect(this.pageTitle).toContainText("Dashboard");
  }

  //Check if the user is view only
  async expectViewUser() {
    //Check if the viewer badge contains read-only
    await expect(this.viewerBadge).toContainText("Read-only");

    //Check if the role indicator contains read-only
    await expect(this.roleIndicator).toContainText("Read-only Viewer");

    //Check if the add account is hidden
    await expect(this.addAccountButton).toBeHidden();
  }
}
