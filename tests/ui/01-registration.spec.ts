import { test, expect } from "@playwright/test";
import { UsersForm } from "../../page-objects/UsersForm";

test.describe("Test registrace", () => {
  test.beforeAll(async ({ baseURL }) => {
    console.log("UI Base URL:", baseURL);
  });
  test.only("1.1.1 Úspěšná registrace (POS)", async ({ page }) => {
    const usersForm = new UsersForm(page);
    const email = `testuser_${Date.now()}@example.com`;
    const password = "MyPassword";

    await page.goto("/");
    await usersForm.register(email, password);
    await expect(usersForm.getRegistrationSuccessMessage()).toHaveText(
      "User registered"
    );
  });
  test("1.1.2 Neplatný email spustí HTML validaci (NEG)", async ({ page }) => {
    await page.goto("/");
  });
});

//
// 1.1.3 Duplicitní email (NEG)
