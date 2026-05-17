import { expect } from "@playwright/test";

export class AccountsPage {
  constructor(page) {
    this.page = page;

    //Locators
    this.pageContainer = page.locator('[id="accounts-page-container"]');
    this.dashboardButton = page.getByTestId("nav-dashboard");
    this.summaryBar = page.getByTestId("accounts-summary-bar");
    this.searchInput = page.getByTestId("search-input");
    this.filterType = page.getByTestId("filter-type-select");
    this.sort = page.getByTestId("sort-by-select");
    this.resetFilterButton = page.getByTestId("reset-filters-button");
    this.accountsTable = page.getByTestId("accounts-table");
    this.tableDeleteButton = page.getByLabel("Delete account Checking Account");
    this.accountDetailBalance = page.getByTestId("account-detail-balance");
    this.primarySavingsAccount = page
      .locator('[data-testid^="account-name-"]')
      .getByText("Primary Savings");
    this.transactionButton = page.getByTestId("nav-transactions");

    //Table columns
    this.accountName = page.getByTestId("account-name");
    this.accountsBalance = page.getByTestId("account-balance");
    this.firstAccountCell = page
      .locator('td[data-testid="account-name"][data-editable="true"]')
      .first();
    this.nameEditField = page.getByTestId("inline-edit-input");
    this.tableBalanceHeader = page.getByTestId("sort-balance-header");
    this.accountType = page.getByTestId("account-type");

    //Delete Account modal
    this.deleteAccModal = page.getByTestId("delete-modal");
    this.deleteMsg = page.getByTestId("delete-message");
    this.deleteCancelButton = page.getByTestId("cancel-delete-button");
    this.deleteConfirmButton = page.getByTestId("confirm-delete-button");

    //Create Account Modal Locators
    this.accountNameField = page.getByPlaceholder("e.g., My Savings Account");
    this.accountTypeCombo = page.getByTestId("account-type-select");
    this.initialBalanceField = page.getByTestId("initial-balance-input");
    this.activeRadioButton = page.getByTestId("status-active-radio");
    this.creditOption = page.getByRole("option", { name: "Credit Card" });
    this.overDraftCheckBox = page.getByTestId("overdraft-checkbox");
    this.saveAccountButton = page.getByTestId("save-account-button");
    this.accountModal = page.getByTestId("account-modal");
    this.modalCancelButton = page.getByTestId("cancel-button");
  }

  //Test Actions
  //Create an account
  async createAccount(accountname, balance) {
    //Input the account name
    await this.accountNameField.click();
    await this.page.keyboard.type(accountname);

    //Select Account type
    await this.accountTypeCombo.click();
    await this.creditOption.click();

    //Input initial balance
    await this.initialBalanceField.click();
    await this.page.keyboard.type(balance);

    //Select account status
    await this.activeRadioButton.click();

    //Enable overdraft checkbox
    await this.overDraftCheckBox.click();

    //Save Account
    await this.saveAccountButton.click();
  }

  //Delete an account
  async deleteAccount(decision) {
    //Click the delete button
    await this.tableDeleteButton.click();

    await this.expectDeleteAccountModal();

    if (decision == "yes") {
      await this.deleteConfirmButton.click();
    } else if (decision == "no") {
      await this.deleteCancelButton.click();
    }
  }

  //Edit an account anme by double clicking the name
  async editAccountName(accountname) {
    //Check if the data editing is false
    await expect(this.firstAccountCell).toHaveAttribute(
      "data-editing",
      "false",
    );

    //Double click the account name
    const box = await this.firstAccountCell.boundingBox();
    await this.firstAccountCell.dblclick({
      position: {
        x: box.width - 20,
        y: box.height / 2,
      },
    });

    //Check if the data editing is now true and focused to the field
    await expect(this.firstAccountCell).toHaveAttribute("data-editing", "true");
    await expect(this.nameEditField).toBeVisible();
    await expect(this.nameEditField).toBeFocused();

    //Clear the input and type a new name and save by pressing enter
    await this.nameEditField.clear();
    await this.page.keyboard.type(accountname);
    await this.page.keyboard.press("Enter");

    //Check if the field is now hidden and the name is updated
    await expect(this.nameEditField).toBeHidden();
  }

  //Filter the table
  async filterTable(type) {
    //Filter by savings
    await this.filterType.click();
    await this.page.getByRole("option", { name: type }).click();
  }

  //Sort the table
  async sortTable(sortby) {
    if (sortby == "asc") {
      await this.tableBalanceHeader.click();
    } else if (sortby == "desc") {
      await this.tableBalanceHeader.dblclick();
    }
  }

  //Assertions
  //Check if the user is in the right page
  async expectQuickNavigateAccounts() {
    await expect(this.page).toHaveURL(
      "https://qaplayground.com/bank/accounts?action=add",
    );
  }

  async expectAccountsPageURL() {
    await expect(this.page).toHaveURL("https://qaplayground.com/bank/accounts");
  }

  async expectAccountsLoadSuccessfully() {
    //Wait fot the data to render
    await expect(this.pageContainer).toHaveAttribute("data-loading", "false");

    //Check if the summary bar is visible
    await expect(this.summaryBar).toBeVisible();

    //Check if the search bar is visible
    await expect(this.searchInput).toBeVisible();

    //Check if the account type combo box is visible
    await expect(this.filterType).toBeVisible();

    //Check if the sort combo box is visible
    await expect(this.sort).toBeVisible();

    //Check if the reset filter button is visible
    await expect(this.resetFilterButton).toBeVisible();

    //Check if the accounts table is visible
    await expect(this.accountsTable).toBeVisible();
  }

  //Check if the account name is visible
  async expectAccountName(accountname, visibility) {
    if (visibility == "visible") {
      //Check if the account is in the table
      const account = await this.accountName.allTextContents();
      await expect(account).toContain(accountname);
    } else if (visibility == "hidden") {
      //Check if the account is not the table
      const account = await this.accountName.allTextContents();
      await expect(account).not.toContain(accountname);
    }
  }

  //Check if the action message is shown
  async expectActionMessage(message) {
    await expect(await this.page.getByText(message)).toBeVisible();
  }

  //Check if the delete account modal is shown
  async expectDeleteAccountModal() {
    //Check if the modal of the delete account is shown
    await expect(this.deleteAccModal).toBeVisible();

    //Check if the warning messsage is visible
    await expect(this.deleteMsg).toBeVisible();
  }

  //Check filtered table
  async expectFilteredTable() {
    const accountTypeList = await this.accountType.allTextContents();

    //The table must still have a row of savings account
    await expect(accountTypeList).toContain("Savings");

    //The table must not have checking and credit account
    await expect(accountTypeList).not.toContain("Checking");
    await expect(accountTypeList).not.toContain("Credit");
  }

  //Check sorted table
  async expectSortedTable(sortby) {
    const accountsBalance = await this.accountsBalance.allTextContents();

    if (sortby == "asc") {
      const expectedList = ["$2,500.00", "$5,000.00"];

      await expect(accountsBalance).toEqual(expectedList);
    } else if (sortby == "desc") {
      const expectedList = ["$5,000.00", "$2,500.00"];

      await expect(accountsBalance).toEqual(expectedList);
    } else if (sortby == "none") {
      const expectedList = ["$2,500.00", "$5,000.00"];

      await expect(accountsBalance).toEqual(expectedList);
    }
  }
}
