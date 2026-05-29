import { expect } from "@playwright/test";
import { DashboardPage } from "./DashboardPage.page";
import { existsSync } from "node:fs";

export class TransactionPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.filterAccount = page.getByTestId("filter-account-select");
    this.filterTransType = page.getByTestId("filter-transaction-type-select");
    this.dateFrom = page.getByTestId("date-from-input");
    this.dateTo = page.getByTestId("date-to-input");
    this.applyFilterButton = page.getByTestId("apply-filters-button");
    this.resetFilterButton = page.getByTestId("reset-filters-button");
    this.exportButton = page.getByTestId("export-button");
    this.transSummaryBar = page.getByTestId("transactions-summary-bar");
    this.transTable = page.getByTestId("transactions-table");
    this.dashboardButton = page.getByTestId("nav-dashboard");
    this.accountsButtons = page.getByTestId("nav-accounts");
    this.totalTransaction = page.getByTestId("transactions-tbody");
    this.transAccount = page.getByTestId("transaction-account");
    this.calendar = page.getByTestId("date-picker-calendar");
    this.startDate = page.locator('[aria-label="Friday, May 1st, 2026"]');
    this.endDate = page
      .locator('[aria-label="Sunday, May 31st, 2026"]')
      .first();
    this.dateTimeColumn = page.getByTestId("transaction-date");

    //New transaction modal
    this.transactionModal = page.getByTestId("transaction-modal");
    this.modalTitle = page.getByText("New Transaction", { exact: true });
    this.modalSubHead = page.getByText(
      "Fill in the details to create a new transaction.",
    );
    this.selectTransType = page.getByTestId("transaction-type-select");
    this.fromAcc = page.getByTestId("from-account-select");
    this.toAcc = page.getByTestId("to-account-select");
    this.ammountField = page.getByTestId("transaction-amount-input");
    this.descField = page.getByTestId("transaction-description-input");
    this.notifCheckBox = page.getByTestId("notification-checkbox");
    this.cancelButton = page.getByTestId("cancel-transaction-button");
    this.submitButton = page.getByTestId("submit-transaction-button");

    //Messages
    this.newTransMessage = page.getByText(
      "Transaction completed successfully!",
    );
  }

  //Test Actions
  //Open new transactions
  async newTransaction() {
    await this.dashboardButton.click();

    const dashboard_page = new DashboardPage(this.page);
    await dashboard_page.newTransactionButton.click();
  }

  //Fill up new transaction
  async fillUpNewTransaction(transtype, acc, amount, desc) {
    //Select Transaction Type
    await this.selectTransType.click();
    await this.page.getByRole("option", { name: transtype }).click();

    //Select from account
    await this.fromAcc.click();
    await this.page.getByRole("option", { name: acc }).click();

    //Fill up amount
    await this.ammountField.click();
    await this.page.keyboard.type(amount);

    //Fill up desc
    await this.descField.click();
    await this.page.keyboard.type(desc);
  }

  //Submit new transaction
  async submitTrans() {
    //Click sumbit button
    await this.submitButton.click();
  }

  //Go to accounts
  async gotoAccounts() {
    await this.accountsButtons.click();
  }

  //Filter Account
  async accountFilter(filter) {
    await this.filterAccount.click();
    await this.page.getByRole("option", { name: filter }).click();
    await this.applyFilterButton.click();
  }

  async resetFilter() {
    await this.resetFilterButton.click();
  }

  async selectDate() {
    await this.dateFrom.click();
    await expect(this.calendar).toBeVisible();
    await this.startDate.click();

    await this.dateTo.click();
    await this.endDate.click();

    await this.applyFilterButton.click();
  }

  //Assertions
  //Check if the transaction page loads successfully
  async expectTransactionsLoadsSuccessful() {
    //Check if the account type filter is visible
    await expect(this.filterAccount).toBeVisible();

    //Check if the Transaction type filter is visible
    await expect(this.filterTransType).toBeVisible();

    //Check if the date from is visible
    await expect(this.dateFrom).toBeVisible();

    //Check if the date to is visible
    await expect(this.dateTo).toBeVisible();

    //Check if the apply button is visible
    await expect(this.applyFilterButton).toBeVisible();

    //Check if the reset button is visible
    await expect(this.resetFilterButton).toBeVisible();

    //Check if the export button is visilbe
    await expect(this.exportButton).toBeVisible();

    //Check if the summary bar is visible
    await expect(this.transSummaryBar).toBeVisible();

    //Check if the table is visible
    await expect(this.transTable).toBeVisible();
  }

  //Check if the new transaction modal loads successful
  async expectTransModal() {
    //Check if the modal is visible
    await expect(this.transactionModal).toBeVisible();

    //Check if the header and sub header is visible
    await expect(this.modalTitle).toBeVisible();
    await expect(this.modalSubHead).toBeVisible();

    //Check if the Transaction type combo box is visilbe
    await expect(this.selectTransType).toBeVisible();

    //Check if the from account combo box is visible
    await expect(this.fromAcc).toBeVisible();

    //Check if hte to acc is hidden
    await expect(this.toAcc).toBeHidden();

    //Check if the amount field is visible
    await expect(this.ammountField).toBeVisible();

    //Check if the desc field is visible
    await expect(this.ammountField).toBeVisible();

    //Check if the notif check box is visible
    await expect(this.notifCheckBox).toBeVisible();

    //Check if the cancel and submit button is visible
    await expect(this.cancelButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  //Check if the new transaction message is visible
  async expectTransMessage() {
    await expect(this.newTransMessage).toBeVisible();
  }

  //Check the transactions total count
  async expectTransCount(count) {
    const transCount = await this.totalTransaction.count();
    await expect(transCount).toEqual(count);
  }

  //Check the row's Account name
  async expectAccounts(name) {
    const accountNames = await this.transAccount.allTextContents();

    expect(accountNames.length).toBeGreaterThan(0);

    for (const accountName of accountNames) {
      expect(accountName.trim()).toBe(name);
    }
  }

  //Check if the summary bar reflects to filtered table
  async expectSummaryBar(deposit, withdrawals, net, transaction) {
    const summaryBar = await this.transSummaryBar.allTextContents();
    const expectedSummaryBar = [
      "Deposits: $" +
        deposit +
        "Withdrawals: $" +
        withdrawals +
        "Net: +$" +
        net +
        transaction +
        " transaction",
    ];

    expect(summaryBar).toStrictEqual(expectedSummaryBar);
  }

  //Check if the table shows only todays date
  async expectTableRows() {
    const date = await this.dateTimeColumn.allTextContents();
    const today = new Date();

    const month = today.toLocaleString("en-US", { month: "long" });
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    await expect(date[0]).toContain(formattedDate);
  }

  //check if the reset button works
  async expectReset() {
    const startDateText = await this.dateFrom.textContent();
    const endDateText = await this.dateTo.textContent();

    await expect(startDateText).toContain("Pick start date");
    await expect(endDateText).toContain("Pick end date");
  }
}
