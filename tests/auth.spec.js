import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.page";
import { DashboardPage } from "../pages/DashboardPage.page";

test.describe("Testing the login page of a securebank demo from qaplayground", async () => {
  test("TC-LOGIN-01: Successful login with admin credentials", async ({
    page,
  }) => {
    const login_page = new LoginPage(page);
    const dashboard_page = new DashboardPage(page);

    //Go to the login page
    await login_page.goto();

    //Check if the login page loads successfully
    await login_page.expectLoginPageLoadSuccessfully();

    //Clicks the username and password field and then type admin and admin123
    await login_page.fillUpFields("admin", "admin123");

    //Clicks login button
    await login_page.login();

    //Check if the user goes to the right page of the website (dashboard)
    await dashboard_page.expectDashboardURL();

    //Check if dashboard page loads successfully
    await dashboard_page.expectDashboardLoadSuccessfully();
  });

  test("TC-LOGIN-02: Failed Login shows error alert for invalid credentials", async ({
    page,
  }) => {
    const login_page = new LoginPage(page);

    //Go to the login page
    await login_page.goto();

    //Check if the login page loads successfully
    await login_page.expectLoginPageLoadSuccessfully();

    //Clicks the username and password field and then type wrong and wrong123
    await login_page.fillUpFields("wrong", "wrong123");

    //Clicks login button
    await login_page.login();

    //Check if the login alert shows after invalid login
    await login_page.expectLoginAlert();

    //The user must remain in the login page
    await login_page.expectLoginPage();
  });

  test("TC-LOGIN-03: Toggle password visibility hides and reveals password text", async ({
    page,
  }) => {
    const login_page = new LoginPage(page);

    //Go to the login page
    await login_page.goto();

    //Enter any text in the password field
    await login_page.expectLoginPageLoadSuccessfully();

    //Clicks the password and fill up
    await login_page.fillUpFields("", "admin123");

    //Check if the show password toggle button working properly
    await login_page.expectPasswordToggle();
  });

  test("TC-LOGIN-04: Pressing Enter in the password field submits login form", async ({
    page,
  }) => {
    const login_page = new LoginPage(page);
    const dashboard_page = new DashboardPage(page);

    //Go to the login page
    await login_page.goto();

    //Enter any text in the password field
    await login_page.expectLoginPageLoadSuccessfully();

    //Clicks the username and password and fill up
    await login_page.fillUpFields("admin", "admin123");

    //CLicks the password field and then click enter
    await login_page.pressEnter();

    //Check if the user goes to the right page of the website (dashboard)
    await dashboard_page.expectDashboardURL();

    //Check if the dashboard page loads successfully
    await dashboard_page.expectDashboardLoadSuccessfully();
  });

  test("TC-LOGIN-05: Read-only viewer login grants restricted access", async ({
    page,
  }) => {
    const login_page = new LoginPage(page);
    const dashboard_page = new DashboardPage(page);

    //Go to the login page
    await login_page.goto();

    //Enter any text in the password field
    await login_page.expectLoginPageLoadSuccessfully();

    //Clicks the username and password and login the viewer account
    await login_page.fillUpFields("viewer", "viewer123");

    //CLicks the password field and then click enter
    await login_page.login();

    //Check if the user goes to the right page of the website (dashboard)
    await dashboard_page.expectDashboardURL();

    //Check if the dashboard page loads successfully
    await dashboard_page.expectDashboardLoadSuccessfully();

    //The user must have read-only badge and role.
    //The add account button must be hidden
    await dashboard_page.expectViewUser();
  });
});
