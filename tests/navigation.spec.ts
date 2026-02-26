import { test, expect } from "@playwright/test";

// The Navigation component is the only element with backdrop-blur-3xl.
// Scoping selectors to it avoids false matches from footer/body links.
const NAV = ".backdrop-blur-3xl";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders logo linking to home", async ({ page }) => {
    const logo = page.locator(`${NAV} a[href="/"]`).first();
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("DerivaConnect");
  });

  test("renders About link with correct href", async ({ page }) => {
    const link = page.locator(`${NAV} nav a[href="/infopages/about"]`);
    await expect(link).toBeVisible();
    await expect(link).toHaveText("About");
  });

  test("renders Contact link with correct href", async ({ page }) => {
    const link = page.locator(
      `${NAV} nav a[href="/forms/contact"][aria-label="Contact"]`
    );
    await expect(link).toBeVisible();
    await expect(link).toHaveText("Contact");
  });

  test("renders Express Interest CTA button", async ({ page }) => {
    const cta = page.locator(
      `${NAV} nav a[href="/forms/contact"][aria-label="Express interest"]`
    );
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText("Express Interest");
  });

  test("logo navigates to home page", async ({ page }) => {
    await page.goto("/infopages/about");
    await page.locator(`${NAV} a[href="/"]`).first().click();
    await expect(page).toHaveURL("/");
  });

  test("About link navigates to about page", async ({ page }) => {
    await page.locator(`${NAV} nav a[href="/infopages/about"]`).click();
    await expect(page).toHaveURL("/infopages/about");
  });

  test("Contact link navigates to contact page", async ({ page }) => {
    await page
      .locator(`${NAV} nav a[href="/forms/contact"][aria-label="Contact"]`)
      .click();
    await expect(page).toHaveURL("/forms/contact");
  });

  test("Express Interest navigates to contact page", async ({ page }) => {
    await page
      .locator(
        `${NAV} nav a[href="/forms/contact"][aria-label="Express interest"]`
      )
      .click();
    await expect(page).toHaveURL("/forms/contact");
  });
});

test.describe("Navigation — mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Alpine.js (loaded via defer CDN) to initialize
    await page.waitForFunction(() => typeof (window as any).Alpine !== "undefined");
  });

  test("hamburger button is visible on mobile", async ({ page }) => {
    const hamburger = page.locator(`${NAV} button`);
    await expect(hamburger).toBeVisible();
  });

  test("nav links are hidden before menu opens", async ({ page }) => {
    const nav = page.locator(`${NAV} nav`);
    await expect(nav).toHaveClass(/hidden/);
  });

  test("clicking hamburger reveals nav links", async ({ page }) => {
    await page.locator(`${NAV} button`).click();
    const nav = page.locator(`${NAV} nav`);
    await expect(nav).not.toHaveClass(/hidden/);
    await expect(
      page.locator(`${NAV} nav a[href="/infopages/about"]`)
    ).toBeVisible();
  });

  test("clicking hamburger again hides nav links", async ({ page }) => {
    const hamburger = page.locator(`${NAV} button`);
    await hamburger.click();
    await hamburger.click();
    await expect(page.locator(`${NAV} nav`)).toHaveClass(/hidden/);
  });
});
