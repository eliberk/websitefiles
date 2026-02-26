import { test, expect } from "@playwright/test";

test.describe("Login form — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms/login");
    await page.waitForLoadState("networkidle");
  });

  test("renders email and password fields", async ({ page }) => {
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("password field has type=password", async ({ page }) => {
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });

  test("form POSTs to /api/auth/login", async ({ page }) => {
    await expect(
      page.locator('form[action="/api/auth/login"]')
    ).toBeVisible();
  });

  test("sign up link points to /forms/signup", async ({ page }) => {
    await expect(page.locator('a[href="/forms/signup"]')).toBeVisible();
  });

  test("shows error banner on ?error=1", async ({ page }) => {
    await page.goto("/forms/login?error=1");
    await expect(
      page.getByText("Invalid email or password. Please try again.")
    ).toBeVisible();
  });

  test("shows confirm email banner on ?confirm=1", async ({ page }) => {
    await page.goto("/forms/login?confirm=1");
    await expect(
      page.getByText("Check your email to confirm your account, then sign in.")
    ).toBeVisible();
  });

  test("no banner on clean page load", async ({ page }) => {
    await expect(
      page.getByText("Invalid email or password. Please try again.")
    ).not.toBeVisible();
  });
});

test.describe("Login form — submission", () => {
  test("submitting empty form does not navigate", async ({ page }) => {
    await page.goto("/forms/login");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("/forms/login");
  });

  test("wrong credentials redirect to ?error=1", async ({ page }) => {
    await page.goto("/forms/login");
    await page.fill("#email", "wrong@example.com");
    await page.fill("#password", "wrongpassword");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("/forms/login?error=1");
  });
});

test.describe("Signup form — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms/signup");
    await page.waitForLoadState("networkidle");
  });

  test("renders all fields", async ({ page }) => {
    await expect(page.locator("#first_name")).toBeVisible();
    await expect(page.locator("#last_name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("form POSTs to /api/auth/signup", async ({ page }) => {
    await expect(
      page.locator('form[action="/api/auth/signup"]')
    ).toBeVisible();
  });

  test("sign in link points to /forms/login", async ({ page }) => {
    await expect(page.locator('a[href="/forms/login"]')).toBeVisible();
  });

  test("shows error banner on ?error=1", async ({ page }) => {
    await page.goto("/forms/signup?error=1");
    await expect(
      page.getByText("Sign up failed. The email may already be in use.")
    ).toBeVisible();
  });

  test("submitting empty form does not navigate", async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("/forms/signup");
  });
});

test.describe("Auth — dashboard protection", () => {
  test("visiting /dashboard without auth redirects to login", async ({
    page,
  }) => {
    // No cookies set — middleware should redirect immediately
    await page.goto("/dashboard/contacts");
    await expect(page).toHaveURL("/forms/login");
  });

  test("login page is publicly accessible", async ({ page }) => {
    await page.goto("/forms/login");
    await expect(page).toHaveURL("/forms/login");
  });
});
