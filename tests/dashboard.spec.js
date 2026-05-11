import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { DashboardPage } from "../pages/DashboardPage.page";
import { AccountsPage } from "../pages/AccountsPage.page";

test.describe("Testing the dashboard page", async () => {
  test.beforeEach("Login to the website as admin", async ({ page }) => {
    const login_page = new LoginPage(page);

    await login_page.goto();
    await login_page.expectLoginPageLoadSuccessfully();
    await login_page.fillUpFields("admin", "admin123");
    await login_page.login();
  });

  test("TC-DASH-01: Skeleton loading state appears on page load then data renders", async ({
    page,
  }) => {
    const dashboard_page = new DashboardPage(page);

    //The user must be in the dashboard page after logging in
    await dashboard_page.expectDashboard();

    //Check if the page container is in loading state and the skeleton card are visible
    await dashboard_page.expectSkeletonLoadingState();

    //Check if the data renders
    await dashboard_page.expectDashboardLoadSuccessfully();
  });

  test("TC-DASH-02: Stat card values match actual account and transaction data", async ({
    page,
  }) => {
    const dashboard_page = new DashboardPage(page);
    //Check if the data renders
    await dashboard_page.expectDashboardLoadSuccessfully();

    //Check if the data is the same
    await dashboard_page.verifyData();
  });

  test("TC-DASH-03: Quick Actions navigate to correct pages", async ({
    page,
  }) => {
    const dashboard_page = new DashboardPage(page);
    const account_page = new AccountsPage(page);

    //Check if the data renders
    await dashboard_page.expectDashboardLoadSuccessfully();

    //Click the add acount button
    await dashboard_page.addAccountButton.click();

    //The user must go to the account page
    await account_page.expectQuickNavigateAccounts();

    //The account modal should have shown
    await expect(account_page.accountModal).toBeVisible();

    //Go back to dashboard
    await account_page.modalCancelButton.click();
    await account_page.dashboardButton.click();

    //The user must go back to the dashboard page
    await dashboard_page.expectDashboard();
  });

  test("TC-DASH-04: Recent transactions shows up to 5 latest transactions", async ({
    page,
  }) => {
    const dashboard_page = new DashboardPage(page);
    //Check if the data renders
    await dashboard_page.expectDashboardLoadSuccessfully();

    //Check if the recent transactions has between 0-5 rows
    await dashboard_page.expectTableRows();

    //Check the table data
    await dashboard_page.expectTableData();
  });

  test("TC-DASH-05: Pinned Accounts section supports drag-and-drop reorder", async ({
    page,
  }) => {
    const dashboard_page = new DashboardPage(page);
    //Check if the data renders
    await dashboard_page.expectDashboardLoadSuccessfully();

    //Check the draggable accounts if working
    await dashboard_page.expectDraggableAccount();
  });
});
