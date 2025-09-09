import { test, expect } from "@playwright/test";
import { UsersForm } from "../../page-objects/UsersForm";

test.describe("Test registrace", () => {
  test.beforeAll(async ({ baseURL }) => {
    console.log("UI Base URL:", baseURL);
  });
  test("1.1.1 Úspěšná registrace (POS)", async ({ page }) => {
    const usersForm = new UsersForm(page);
    const email = `testuser_${Date.now()}@example.com`;
    const password = "MyPassword";

    await page.goto("/");
    await usersForm.register(email, password);
    await expect(usersForm.getRegistrationSuccessMessage()).toHaveText(
      "User registered"
    );
  });

  // without POM
  test("1.1.2 Neplatný email spustí HTML validaci (NEG)", async ({ page }) => {
    const invalidEmail = "a.b.c";
    const password = "pwd";

    await page.goto("/");

    const registerButton = page.getByTestId("register-button");
    const emailInputField = page.getByPlaceholder(/email/i);
    const passwordInputField = page.getByPlaceholder(/password/i);
    const submitButton = page.getByTestId("register-submit");

    await registerButton.click();
    await emailInputField.fill(invalidEmail);
    await passwordInputField.fill(password);
    await submitButton.click();

    const isValid = await emailInputField.evaluate((el: HTMLInputElement) =>
      el.checkValidity()
    );
    const validationMessage = await emailInputField.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(isValid).toBe(false);
    expect(validationMessage).toBe(
      `Please include an '@' in the email address. '${invalidEmail}' is missing an '@'.`
    );
  });

  test("1.1.3 Duplicitní email (NEG)", async ({ page }) => {
    const email = `user_${Date.now()}@icanbreakit.eu`;
    const password = "password";

    const usersForm = new UsersForm(page);
    await page.goto("/");
    await usersForm.register(email, password);
    expect(await usersForm.isRegisteredSuccessfully()).toBeTruthy();

    await usersForm.register(email, password);
    expect(await usersForm.isRegEmailDuplicite()).toBeTruthy();
  });
});
