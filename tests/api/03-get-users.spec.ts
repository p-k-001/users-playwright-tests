import { test, expect, APIRequestContext } from "@playwright/test";

interface User {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  age: string;
  role: string; // TODO: enum
}

let myContext: APIRequestContext;
const BASE_URL = "http://localhost:3000";

let serviceToken: string;
// used for cleaning db
const serviceUser: User = {
  email: `user_${Date.now()}@icanbreatit.eu}`,
  password: `myPassword`,
};

const user: User = {
  email: `user_${Date.now()}@icanbreatit.eu}`,
  password: `myPassword`,
};

const validUserData = {
  name: "tmp",
  email: "tmp@a.cz",
  age: "22",
  role: "admin",
};

test.describe("CRUD - GET users", async () => {
  // create serviceUSer
  test.beforeAll(async ({ request }) => {
    await request.post(BASE_URL + "/register", { data: serviceUser });
    const { token } = await (
      await request.post(BASE_URL + "/login", { data: serviceUser })
    ).json();
    serviceToken = token;
  });

  // clean db
  test.beforeEach(async ({ playwright }) => {
    myContext = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        Authentization: `Bearer ${serviceToken}`,
      },
    });
    await myContext.delete(BASE_URL + "/users");
    myContext.dispose();
  });

  test.only("3.1. Vrátí seznam uživatelů (když existují) (POS)", async ({
    playwright,
    request,
  }) => {
    const resRegister = await request.post("/register", { data: user });
    const resLogin = await request.post("/login", { data: user });

    const { token } = await resLogin.json();
    myContext = await playwright.request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resPostUser = await myContext.post("/users", { data: validUserData });

    const resGetUsers = await myContext.get("/users");
    const result = await resGetUsers.json();
    console.log(result);
    expect(result).toContainEqual(
      expect.objectContaining({
        ...validUserData,
        age: Number(validUserData.age), // result returns Number, not a string
      })
    );
  });
});

// 2.2.1. Vrátí seznam uživatelů (když existují) (POS)
// 2.2.2. Vrátí prázdné pole, pokud DB neobsahuje uživatele (POS)
// 2.2.3. Vrátí uživatele podle platného ID – `200 OK` (POS)
// 2.2.4. Nevrátí uživatele podle platného ID pro cizího ownera – `404 User not found` (NEG)
// 2.2.5. Neexistující ID – `404 User not found` (NEG)
// 2.2.6. Neplatné ID (např. `abc`) – `400 Invalid ID` (NEG)
// 2.2.7. Bez JWT – `401 No token provided` (NEG)
// 2.2.8. S neplatným JWT – `403 Invalid token` (NEG)
