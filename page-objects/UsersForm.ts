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

  private get showLoginButton(): Locator {
    return this.page.getByTestId("show-login-button");
  }
  private get emailLoginInput(): Locator {
    return this.page.getByTestId("email-login-input");
  }

  private get passwordLoginInput(): Locator {
    return this.page.getByTestId("password-login-input");
  }

  private get submitLoginButton(): Locator {
    return this.page.getByTestId("submit-login-button");
  }

  private get userLoggedinText(): Locator {
    return this.page.getByTestId("user-loggedin");
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

  public async isRegisteredSuccessfully(): Promise<boolean> {
    const message = await this.registrationSuccessMessage.innerText();
    return message === "User registered";
  }

  public async isRegEmailDuplicite(): Promise<boolean> {
    const message = await this.registrationSuccessMessage.innerText();
    return message === "Email already exists";
  }

  public async login(email: string, password: string): Promise<void> {
    await this.showLoginButton.click();
    await this.emailLoginInput.fill(email);
    await this.passwordLoginInput.fill(password);
    await this.submitLoginButton.click();
  }

  public async getUserLoggedinText(): Promise<string> {
    return await this.userLoggedinText.innerText();
  }
}
