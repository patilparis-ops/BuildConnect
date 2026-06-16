import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("renders hero section with key elements", async ({ page }) => {
    // Hero heading
    await expect(
      page.getByRole("heading", { name: /your vision/i })
    ).toBeVisible();

    // CTA buttons — use .first() since "Post a Project" appears in hero + final CTA
    const postProjectCta = page.getByRole("link", { name: /post a project/i }).first();
    await expect(postProjectCta).toBeVisible();
    await expect(postProjectCta).toHaveAttribute("href", "/register/customer");

    const joinCta = page.getByRole("link", { name: /join as contractor/i }).first();
    await expect(joinCta).toBeVisible();
    await expect(joinCta).toHaveAttribute("href", "/register/contractor");

    // Search bar in hero
    await expect(
      page.getByPlaceholder("Search projects, contractors, or services...")
    ).toBeVisible();
  });

  test("categories section renders", async ({ page }) => {
    await page.getByText("Find the right professional").scrollIntoViewIfNeeded();
    await expect(
      page.getByText("Find the right professional")
    ).toBeVisible();
  });

  test("how it works toggle tabs work", async ({ page }) => {
    await page.getByText("How BuildConnect Works").scrollIntoViewIfNeeded();

    // Default should show homeowner steps — use first() since step headings appear in the toggle banner too
    await expect(page.getByText("Post Your Project").first()).toBeVisible();

    // Click contractors tab
    await page.getByRole("button", { name: /for contractors/i }).click();
    await expect(page.getByText("Create Profile").first()).toBeVisible();

    // Switch back to homeowners
    await page.getByRole("button", { name: /for homeowners/i }).click();
    await expect(page.getByText("Post Your Project").first()).toBeVisible();
  });

  test("faq accordion expands and collapses", async ({ page }) => {
    await page.getByText("Frequently Asked Questions").scrollIntoViewIfNeeded();

    // Click first FAQ question
    const firstQuestion = page.locator("details summary").first();
    await firstQuestion.click();

    // Should expand and show answer
    const details = page.locator("details").first();
    await expect(details).toHaveAttribute("open");
  });

  test("footer has navigation links", async ({ page }) => {
    // "About" appears in both navbar and footer — target the footer specifically
    await expect(
      page.locator("footer").getByRole("link", { name: /about/i })
    ).toBeVisible();
  });

  test("navigates to login page and shows form", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();
    await expect(
      page.getByLabel(/email/i)
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();
  });
});
