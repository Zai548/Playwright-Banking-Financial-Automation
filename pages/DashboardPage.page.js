import { expect } from "@playwright/test";
import { AccountsPage } from "./AccountsPage.page";

export class DashboardPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageTitle = page.getByTestId("page-title");
    this.brandName = page.locator('[id="brand-name"]');
    this.viewerBadge = page.getByTestId("viewer-badge");
    this.roleIndicator = page.getByTestId("role-indicator");
    this.pageContainer = page.locator('[id="dashboard-page-container"]');
    this.skeletonCard = page.getByTestId("skeleton-card");
    this.totalBalance = page.getByTestId("total-balance");
    this.accounts = page.getByTestId("accounts-count");
    this.tableRows = page.getByTestId("transactions-tbody");
    this.draggableAccounts = page.locator(
      '[draggable="true"][data-testid^="draggable-account-"]',
    );
    this.pinnedAccountsDropZone = page.getByTestId("drop-zone");

    //Texts
    this.quickActionText = page.getByText("Quick Actions", { exact: "true" });
    this.quickStatsText = page.getByText("Quick Stats", { exact: "true" });
    this.pinnedAccountsText = page.getByText("Pinned Accounts", {
      exact: "true",
    });
    this.recentTransacText = page.getByText("Recent Transactions", {
      exact: "true",
    });
    this.accountOverviewText = page.getByText("Accounts Overview", {
      exact: "true",
    });

    //Cards
    this.totalBalanceCard = page.getByTestId("total-balance-card");
    this.accountsCard = page.getByTestId("accounts-count-card");
    this.transactionCard = page.getByTestId("transactions-count-card");

    //Buttons
    this.addAccountButton = page.getByTestId("quick-add-account");
    this.newTransactionButton = page.getByTestId("quick-new-transaction");
    this.viewAllAccountButton = page.getByTestId("quick-view-accounts");

    //Charts
    this.pageQuickStatsChart = page.getByTestId("quick-stats-chart");

    //Drop zone
    this.pinnedAccountsDropZone = page.getByTestId("drop-zone");

    //Table
    this.recentTransacTable = page.getByTestId("recent-transactions-table");

    //Grid
    this.accountsGrid = page.getByTestId("accounts-grid");
  }

  //Test Actions
  async gotoAccounts() {
    await this.page.goto("https://qaplayground.com/bank/accounts");
  }

  //Assertions
  //Check if the user is in the right page
  async expectDashboardURL() {
    await expect(this.page).toHaveURL(
      "https://qaplayground.com/bank/dashboard",
    );
  }

  //Check if the dashboard page loads successfully
  async expectDashboardLoadSuccessfully() {
    //Wait fot the data to render
    await expect(this.pageContainer).toHaveAttribute("data-loading", "false", {
      timeout: 2000,
    });

    //Check if the page title has a Dashboard text
    const pageTitleText = await this.pageTitle.allTextContents();
    await expect(this.pageTitle).toContainText("Dashboard");

    //Check if the brand name is visible
    await expect(this.brandName).toBeVisible();

    //Check if the texts are visible
    await expect(this.quickActionText).toBeVisible();
    await expect(this.quickStatsText).toBeVisible();
    await expect(this.pinnedAccountsText).toBeVisible();
    await expect(this.recentTransacText).toBeVisible();
    await expect(this.accountOverviewText).toBeVisible();

    //Check if the cards are visible
    await expect(this.totalBalanceCard).toBeVisible();
    await expect(this.totalBalanceCard).toContainText("$7,500.00");

    await expect(this.accountsCard).toBeVisible();
    await expect(this.accountsCard).toContainText("2");

    await expect(this.transactionCard).toBeVisible();
    await expect(this.transactionCard).toContainText("1");

    //Check if the buttons are visible
    await expect(this.addAccountButton).toBeVisible();
    await expect(this.newTransactionButton).toBeVisible();
    await expect(this.viewAllAccountButton).toBeVisible();

    //Check if the quick stats chart is visible
    await expect(this.pageQuickStatsChart).toBeVisible();

    //Check if the pinned account grid is visible
    await expect(this.pinnedAccountsDropZone).toBeVisible();

    //Check if the recent transaction table is visible
    await expect(this.recentTransacTable).toBeVisible();

    //Check if the accounts overview
    await expect(this.accountsGrid).toBeVisible();
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

  //Check if the skeleton loading state is working
  async expectSkeletonLoadingState() {
    //Check if the page container is loading
    await expect(this.pageContainer).toHaveAttribute("data-loading", "true");

    //Check if the skeleton cards are visible
    await expect(this.skeletonCard).toHaveCount(5);
  }

  //Check if the total balances in the accounts page is the same in the dashboard cards
  async verifyData() {
    const account_page = new AccountsPage(this.page);

    //Get the balance in the dashboard card
    const totalBalanceText = await this.totalBalance.textContent();
    const totalBalance = Number(totalBalanceText.replace("$", ""));

    //Get the number of accounts in the dashboard card
    const totalAccount = await this.accounts.allTextContents();

    //Go to accounts page
    await this.gotoAccounts();

    //Check if the data renders successfully
    await account_page.expectAccountsLoadSuccessfully();

    //Collect all of the balances in the accounts
    const balance = await account_page.accountsBalance.allTextContents();
    const accountBalance = balance
      .map((price) => Number(price.replace("$", "")))
      .reduce((total, price) => total + price, 0);

    //Get the number of accounts
    const accounts = await account_page.accountsBalance.count();

    //Check if the 2 values are equal
    await expect(totalBalance).toBe(accountBalance);
    await expect(accounts).toBe(Number(totalAccount));
  }

  //Check if the table rows contains 1-5 number of rows
  async expectTableRows() {
    const rowCount = await this.tableRows.count();

    //Check if the table rows contains 1 to 5 rows
    await expect(rowCount).toBeGreaterThanOrEqual(1);
    await expect(rowCount).toBeLessThanOrEqual(5);
  }

  //Assert the data of rows
  async expectTableData() {
    //Check if the table rows has the exact data
    await expect(this.tableRows).toContainText("May 11, 2026");
    await expect(this.tableRows).toContainText("Deposit");
    await expect(this.tableRows).toContainText("Primary Savings");
    await expect(this.tableRows).toContainText("+$1,000.00");
    await expect(this.tableRows).toContainText("Completed");
  }

  //Check if the dragable account is working
  async expectDraggableAccount() {
    const source = this.draggableAccounts.first();
    const dropZone = this.pinnedAccountsDropZone;

    await expect(source).toBeVisible();
    await expect(dropZone).toBeVisible();

    await expect(dropZone).toHaveAttribute("data-drop-active", "false");

    await source.dispatchEvent("dragstart", {
      dataTransfer: await this.page.evaluateHandle(() => new DataTransfer()),
    });

    await dropZone.dispatchEvent("dragenter", {
      dataTransfer: await this.page.evaluateHandle(() => new DataTransfer()),
    });

    await dropZone.dispatchEvent("dragover", {
      dataTransfer: await this.page.evaluateHandle(() => new DataTransfer()),
    });

    await expect(dropZone).toHaveAttribute("data-drop-active", "true");

    await dropZone.dispatchEvent("dragleave", {
      dataTransfer: await this.page.evaluateHandle(() => new DataTransfer()),
    });

    await expect(dropZone).toHaveAttribute("data-drop-active", "false");
  }
}
