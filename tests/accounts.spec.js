import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { DashboardPage } from "../pages/DashboardPage.page";
import { AccountsPage } from "../pages/AccountsPage.page";

test.describe("Testing the accounts page", async () => {
  test.beforeEach("Login to the website as admin", async ({ page }) => {
    const login_page = new LoginPage(page);
    const dashboard_page = new DashboardPage(page);
    const account_page = new AccountsPage(page);

    //Login to the website
    await login_page.goto();
    await login_page.expectLoginPageLoadSuccessfully();
    await login_page.fillUpFields("admin", "admin123");
    await login_page.login();

    //The user must be in the dashboard page after logging in
    await dashboard_page.expectDashboardURL();

    //Go to accounts page
    await dashboard_page.gotoAccounts();

    //Check if the accounts page loads successfully
    await account_page.expectAccountsLoadSuccessfully();
  });

  test("TC-ACC-01: Create New Account", async ({ page }) => {
    const dashboard_page = new DashboardPage(page);
    const account_page = new AccountsPage(page);

    await account_page.dashboardButton.click();

    //Create Account
    await dashboard_page.addAccountButton.click();
    await account_page.createAccount("Grocery Savings", "5000");

    //Check if the account is created
    await account_page.expectAccountName("Grocery Savings", "visible");

    //Check if the message is shown
    await account_page.expectActionMessage("Account created successfully!");
  });

  test("TC-ACC-02: Edit account name inline by double-clicking the name cell", async ({
    page,
  }) => {
    const account_page = new AccountsPage(page);

    //Edit the account name
    await account_page.editAccountName("Secondary Savings");

    //Check if the account is updated successfully
    await account_page.expectAccountName("Secondary Savings", "visible");

    //Check if the message is shown
    await account_page.expectActionMessage("Account name updated");
  });

  test("TC-ACC-03: Delete an account with confirmation and verify it is removed", async ({
    page,
  }) => {
    const account_page = new AccountsPage(page);

    //Cancel delete account
    await account_page.deleteAccount("no");
    await account_page.expectAccountName("Checking Account", "visible");

    //Proceed delete account
    await account_page.deleteAccount("yes");
    await account_page.expectAccountName("Checking Account", "hidden");
    await account_page.expectActionMessage("Account deleted successfully");
  });

  test("TC-ACC-04: Filter Account by type", async ({ page }) => {
    const account_page = new AccountsPage(page);

    await account_page.filterTable("Savings");
    await account_page.expectFilteredTable();
  });

  test.describe("TC-ACC-05: Sort accounts by balance column header (ascending -> descending -> none)", async () => {
    test("sort by ascending", async ({ page }) => {
      const account_page = new AccountsPage(page);

      //Ascending sort
      await account_page.sortTable("asc");
      await account_page.expectSortedTable("asc");
    });

    test("sort by descending", async ({ page }) => {
      const account_page = new AccountsPage(page);

      //Descending sort
      await account_page.sortTable("desc");
      await account_page.expectSortedTable("desc");
    });

    test("sort by none", async ({ page }) => {
      const account_page = new AccountsPage(page);

      //None (sorted by account name by default)
      await account_page.expectAccountName("none");
    });
  });
});
