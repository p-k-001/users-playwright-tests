import { test, expect } from "@playwright/test";

test.describe("Public endpoint for testing purposes", async () => {
  test("1.1.1. Should return welcome text", async ({ request }) => {
    const response = await request.get("/hello");

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      message: "Hello, API Testing!",
    });
  });
});
