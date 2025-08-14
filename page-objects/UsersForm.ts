import { expect, Locator, Page } from "@playwright/test";

export class UsersForm {
  constructor(private page: Page) {}

  private get registerButton(): Locator {
    return this.page.getByTestId("register-button");
  }

  private get emailInput(): Locator {
    return this.page.getByTestId("email-input");
  }

  private get passwordInput(): Locator {
    return this.page.getByTestId("password-input");
  }

  private get submitButton(): Locator {
    return this.page.getByTestId("register-submit");
  }

  private get registrationSuccessMessage(): Locator {
    return this.page.getByTestId("registration-message");
  }

  public async register(email: string, password: string): Promise<void> {
    await this.registerButton.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  public getRegistrationSuccessMessage(): Locator {
    return this.registrationSuccessMessage;
  }
}
