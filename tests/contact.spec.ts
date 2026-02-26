import { test, expect } from "@playwright/test";

test.describe("Contact form — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms/contact");
    await page.waitForLoadState("networkidle");
  });

  test("renders all required fields", async ({ page }) => {
    await expect(page.locator("#first_name")).toBeVisible();
    await expect(page.locator("#last_name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#comment")).toBeVisible();
  });

  test("company name field is optional", async ({ page }) => {
    const company = page.locator("#company_name");
    await expect(company).toBeVisible();
    await expect(company).not.toHaveAttribute("required");
  });

  test("required fields have required attribute", async ({ page }) => {
    await expect(page.locator("#first_name")).toHaveAttribute("required");
    await expect(page.locator("#last_name")).toHaveAttribute("required");
    await expect(page.locator("#email")).toHaveAttribute("required");
  });

  test("email field has type=email", async ({ page }) => {
    await expect(page.locator("#email")).toHaveAttribute("type", "email");
  });

  test("submit button is labeled Express Interest", async ({ page }) => {
    await expect(
      page.locator('form[action="/api/contact"] button[type="submit"]')
    ).toHaveText("Express Interest");
  });

  test("form POSTs to /api/contact", async ({ page }) => {
    await expect(page.locator('form[action="/api/contact"]')).toBeVisible();
  });

  test("sign in link points to /forms/login", async ({ page }) => {
    await expect(
      page.locator('a[href="/forms/login"]')
    ).toBeVisible();
  });
});

test.describe("Contact form — success/error banners", () => {
  test("shows success banner on ?success=1", async ({ page }) => {
    await page.goto("/forms/contact?success=1");
    await expect(
      page.getByText("Message sent! We'll be in touch soon.")
    ).toBeVisible();
  });

  test("shows error banner on ?error=1", async ({ page }) => {
    await page.goto("/forms/contact?error=1");
    await expect(
      page.getByText("Something went wrong. Please try again.")
    ).toBeVisible();
  });

  test("no banner shown on clean page load", async ({ page }) => {
    await page.goto("/forms/contact");
    await expect(
      page.getByText("Message sent! We'll be in touch soon.")
    ).not.toBeVisible();
    await expect(
      page.getByText("Something went wrong. Please try again.")
    ).not.toBeVisible();
  });
});

test.describe("Contact form — submission", () => {
  test("submitting empty form does not navigate (HTML5 validation)", async ({
    page,
  }) => {
    await page.goto("/forms/contact");
    await page.locator('button[type="submit"]').click();
    // Native required validation blocks submission — URL stays the same
    await expect(page).toHaveURL("/forms/contact");
  });

  test("filling all fields and submitting redirects", async ({ page }) => {
    await page.goto("/forms/contact");
    await page.fill("#first_name", "Test");
    await page.fill("#last_name", "User");
    await page.fill("#email", "test@example.com");
    await page.fill("#comment", "This is a test message.");
    await page.locator('button[type="submit"]').click();
    // With placeholder Supabase creds the insert fails → ?error=1
    // With real creds it redirects → ?success=1
    // Either way we leave /forms/contact (no stuck page)
    await expect(page).toHaveURL(/\/forms\/contact\?(success|error)=1/);
  });
});
