import { expect } from "@playwright/test";

export class AccountsPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.accountsBalance = page.getByTestId("account-balance");
    this.pageContainer = page.locator('[id="accounts-page-container"]');
    this.accountModal = page.getByTestId("account-modal");
    this.modalCancelButton = page.getByTestId("cancel-button");
    this.dashboardButton = page.getByTestId("nav-dashboard");
  }

  //Assertions
  //Check if the user is in the right page
  async expectQuickNavigateAccounts() {
    await expect(this.page).toHaveURL(
      "https://qaplayground.com/bank/accounts?action=add",
    );
  }
}
