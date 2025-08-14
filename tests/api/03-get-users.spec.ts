import { UsersApi } from "../../api-objects/UsersApi";
import { AuthApi } from "../../api-objects/AuthApi";
import { User, UserDataRequest, UserDataResponse } from "../../types";

import { test, expect, APIRequestContext } from "@playwright/test";

let serviceContext: APIRequestContext;

let serviceToken: string;
// used for cleaning db
const serviceUser: User = {
  email: `user_${Date.now()}@icanbreatit.eu}`,
  password: `myPassword`,
};

const testUser: User = {
  email: `user_${Date.now()}@icanbreatit.eu}`,
  password: `myPassword`,
};

const validUserData: UserDataRequest = {
  name: "tmp",
  email: "tmp@icanbreakit.eu",
  age: "22",
  role: "admin",
};

test.describe("CRUD - GET users", () => {
  // create serviceUSer
  test.beforeAll(async ({ request, baseURL }) => {
    const authApi = new AuthApi(request);
    serviceToken = await authApi.registerAndGetLoginToken(serviceUser);
    console.log("API Base URL:", baseURL);
  });

  // clean db
  test.beforeEach(async ({ playwright }) => {
    serviceContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${serviceToken}`,
      },
    });
    const usersApi = new UsersApi(serviceContext);
    await usersApi.deleteAllUsers();
    serviceContext.dispose();
  });

  test("2.2.1. Vrátí seznam uživatelů (když existují) (POS)", async ({
    playwright,
    request,
  }) => {
    const authApi = new AuthApi(request);

    const token = await authApi.registerAndGetLoginToken(testUser);
    const testContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const usersApi = new UsersApi(testContext);

    await usersApi.postUser(validUserData);
    const resGetUsers = await usersApi.getUsers();
    const result = await resGetUsers.json();

    expect(result).toContainEqual(
      expect.objectContaining({
        ...validUserData,
        age: Number(validUserData.age), // result returns Number, not a string
      })
    );
    await testContext.dispose();
  });

  // 2.2.2. Vrátí prázdné pole, pokud DB neobsahuje uživatele (POS)
  test("2.2.2. Vrátí prázdné pole, pokud DB neobsahuje uživatele (POS)", async ({
    request,
  }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.registerAndGetLoginToken(testUser);
    // without token in context:
    const res = await request.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();

    expect(Array.isArray(resJson)).toBeTruthy();
    expect(resJson.length).toBe(0);
  });

  // 2.2.3. Vrátí uživatele podle platného ID – `200 OK` (POS)
  test("2.2.3. Vrátí uživatele podle platného ID – `200 OK` (POS)", async ({
    request,
    playwright,
  }) => {
    const authApi = new AuthApi(request);

    const token = await authApi.registerAndGetLoginToken(testUser);
    const testContext = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const usersApi = new UsersApi(testContext);

    const resPost = await usersApi.postUser(validUserData);
    const resJson = await resPost.json();
    const userId = resJson.id;

    const resGet = await usersApi.getUser(userId);
    const resGetJson = await resGet.json();
    expect(resGetJson.id).toBe(userId);
    expect(resGetJson.name).toBe(validUserData.name);
    // TODO: add other assertions
  });
});

// 2.2.4. Nevrátí uživatele podle platného ID pro cizího ownera – `404 User not found` (NEG)
// 2.2.5. Neexistující ID – `404 User not found` (NEG)
// 2.2.6. Neplatné ID (např. `abc`) – `400 Invalid ID` (NEG)
// 2.2.7. Bez JWT – `401 No token provided` (NEG)
// 2.2.8. S neplatným JWT – `403 Invalid token` (NEG)
