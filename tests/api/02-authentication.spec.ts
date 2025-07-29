import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const REGISTER_ENDPOINT = `${BASE_URL}/register`;
const LOGIN_ENDPOINT = `${BASE_URL}/login`;

test.describe("Authentication API", () => {
  // 2.1.1 Registration with valid email/password
  test("2.1.1 Should register successfully with valid email and password", async ({
    request,
  }) => {
    const validUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: "MyPassword",
    };

    const response = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    expect(response.status()).toBe(201);

    const json = await response.json();
    expect(json.message).toBe("User registered");
    expect(json.email).toBe(validUser.email);
  });

  // 2.1.2 Registration with existing email
  test("2.1.2 Should fail registration with an already existing email", async ({
    request,
  }) => {
    const validUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: "MyPassword",
    };

    // register a user successfully
    console.log(validUser);
    const responseOk = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    expect(responseOk.status()).toBe(201);

    // register the same user again
    const responseNok = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    const json = await responseNok.json();
    expect(json.message).toBe("Email already exists");
  });

  // 2.1.3 Registration without email/password
  test("2.1.3 Should fail registration without email and password", async ({
    request,
  }) => {
    const response = await request.post(REGISTER_ENDPOINT, {
      data: {},
    });

    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json.message).toBe("Email and password are required");
  });

  // 2.1.4 Registration with invalid email format
  test.fail(
    "2.1.4 Should fail registration with invalid email format",
    async ({ request }) => {
      const response = await request.post(REGISTER_ENDPOINT, {
        data: {
          email: "invalid-email-format",
          password: "some-password",
        },
      });

      expect(response.status()).toBe(400);

      const json = await response.json();
      // TODO: update backend to return "Invalid email format"
      expect(json.message).toMatch(/invalid/i);
    }
  );

  // 2.1.5 Login with valid credentials
  test("2.1.5 Should login successfully with correct credentials", async ({
    request,
  }) => {
    const validUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: "MyPassword",
    };

    const responseRegister = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    expect(responseRegister.status()).toBe(201);

    const responseLogin = await request.post(LOGIN_ENDPOINT, {
      data: validUser,
    });

    expect(responseLogin.status()).toBe(200);

    const json = await responseLogin.json();
    expect(json.token).toBeDefined(); // JWT token should exist
  });

  // 2.1.6 Login with wrong password
  test("2.1.6 Should fail login with wrong password", async ({ request }) => {
    const validUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: "MyPassword",
    };

    const responseRegister = await request.post(REGISTER_ENDPOINT, {
      data: validUser,
    });

    expect(responseRegister.status()).toBe(201);

    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: validUser.email,
        password: "MyWrongPassword",
      },
    });

    expect(response.status()).toBe(401);

    const json = await response.json();
    expect(json.message).toBe("Invalid email or password");
  });

  // 2.1.7 Login with non-existing account
  test("2.1.7 Should fail login with non-existing account", async ({
    request,
  }) => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: `nonexisting_${Date.now()}@example.com`,
        password: "NoSuchUser123",
      },
    });

    expect(response.status()).toBe(401);

    const json = await response.json();
    expect(json.message).toBe("Invalid email or password");
  });
});
