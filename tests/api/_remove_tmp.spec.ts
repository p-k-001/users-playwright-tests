import { test, expect, APIRequestContext } from "@playwright/test";

let apiContext: APIRequestContext;
const BASE_URL = "http://localhost:3000";
const validUser = {
  email: `testuser_${Date.now()}@example.com`,
  password: "MyPassword",
};
const userData = { name: "tmp", email: "tmp@a.cz", age: "22", role: "admin" };

test.beforeAll(async ({ playwright }) => {
  // Vytvoření contextu s baseURL
  apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
  });

  // Registrace uživatele
  const registrationResponse = await apiContext.post("/register", {
    data: validUser,
  });

  // Přihlášení a získání tokenu
  const loginResponse = await apiContext.post("/login", {
    data: validUser,
  });
  const { token } = await loginResponse.json();

  // Nastavení Authorization headeru pro všechny další požadavky
  await apiContext.dispose(); // uvolníme předchozí kontext
  apiContext = await playwright.request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test.skip("POST /users", async () => {
  const response = await apiContext.post("/users", {
    data: userData,
  });
  expect(response.status()).toBe(201);
});

test.skip("GET /users", async () => {
  const response = await apiContext.get("/users");
  expect(response.status()).toBe(200);
  const body = await response.json();

  console.log(validUser.email);

  expect(body[0].name).toEqual(userData.name);
});
