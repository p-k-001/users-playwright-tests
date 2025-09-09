import { test, expect } from "@playwright/test";
import { UsersForm } from "../../page-objects/UsersForm";

const API_URL = process.env.BASE_URL_API;
const REGISTER_ENDPOINT = `${API_URL}/register`;

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    page.goto("/");
  });

  test("2.1.1 Správné údaje (POS)", async ({ page, request }) => {
    const userForm = new UsersForm(page);
    console.log(API_URL);

    const validUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: "MyPassword",
    };

    // register a user
    const responseOk = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    await userForm.login(validUser.email, validUser.password);
    expect(await userForm.getUserLoggedinText()).toBe(
      `Logged in as: ${validUser.email}`
    );
  });
});

// Špatné údaje - chybný e-mail (NEG)
// Špatné údaje - chybné heslo (NEG)
