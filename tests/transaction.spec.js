import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { DashboardPage } from "../pages/DashboardPage.page";
import { TransactionPage } from "../pages/TransactionPage.page";
import { AccountsPage } from "../pages/AccountsPage.page";

test.describe("Testing the transaction page", async () => {
  test.beforeEach("Login to the website as admin", async ({ page }) => {
    const login_page = new LoginPage(page);
    const dashboard_page = new DashboardPage(page);
    const transaction_page = new TransactionPage(page);

    //Login to the website
    await login_page.goto();
    await login_page.expectLoginPageLoadSuccessfully();
    await login_page.fillUpFields("admin", "admin123");
    await login_page.login();

    //The user must be in the dashboard page after logging in
    await dashboard_page.expectDashboardURL();

    //Go to accounts page
    await dashboard_page.gotoTransaction();

    //Check if the accounts page loads successfully
    await transaction_page.expectTransactionsLoadsSuccessful;
  });

  test("TC-TXN-01: Create a deposit transaction and verify balance update", async ({
    page,
  }) => {
    const transaction_page = new TransactionPage(page);
    const account_page = new AccountsPage(page);

    await transaction_page.gotoAccounts();
    await account_page.expectAccountsLoadSuccessfully();
    await account_page.primarySavingsAccount.click();
    const currentBalance =
      await account_page.accountDetailBalance.textContent();

    await account_page.transactionButton.click();

    //Open the new transaction form
    await transaction_page.newTransaction();

    //Check if the form loads succesful
    await transaction_page.expectTransModal();

    //Fill up the form
    await transaction_page.fillUpNewTransaction(
      "Deposit",
      "Primary Savings",
      "500",
      "deposit",
    );
    await transaction_page.submitTrans();

    //Check if the success message
    await transaction_page.expectTransMessage();

    await transaction_page.gotoAccounts();
    await account_page.expectAccountsLoadSuccessfully();
    await account_page.primarySavingsAccount.click();
    const updatedBalance =
      await account_page.accountDetailBalance.textContent();

    const updatedBalanceNumber = Number(updatedBalance.replace(/[$,]/g, ""));
    const currentBalanceNumber = Number(currentBalance.replace(/[$,]/g, ""));

    const balanceDiff = updatedBalanceNumber - currentBalanceNumber;

    await expect(balanceDiff).toBe(500);
  });

  test("TC-TXN-02: Filter transactions by account and verify only matching rows appear", async ({
    page,
  }) => {
    const transaction_page = new TransactionPage(page);

    const transactionCount = await transaction_page.totalTransaction.count();

    await transaction_page.accountFilter("Primary Savings");

    await transaction_page.expectAccounts("Primary Savings");

    await transaction_page.expectSummaryBar(
      "1,000.00",
      "0.00",
      "1,000.00",
      "1",
    );

    await transaction_page.resetFilter();

    await transaction_page.expectTransCount(1);
  });
});
