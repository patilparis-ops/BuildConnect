import { test, expect } from "@playwright/test";

test("Generate project and navigate to preview", async ({ page }) => {
  await page.goto("/workspace");

  const uploadResponsePromise = page.waitForResponse(response =>
    response.url().includes("/api/upload") &&
    response.request().method() === "POST"
  );

  await page.setInputFiles("#file-upload-input", {
    name: "sample.png",
    mimeType: "image/png",
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  });

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.status()).toBe(201);

  await page.fill("textarea", "Create a fintech dashboard");

  const generateResponsePromise = page.waitForResponse(response =>
    response.url().includes("/api/generate") &&
    response.request().method() === "POST"
  );

  await page.getByRole("button", { name: "Generate", exact: true }).click();

  const generateResponse = await generateResponsePromise;
  expect(generateResponse.status()).toBe(201);

  await page.waitForURL(/\/preview\//);

  await expect(page).toHaveURL(/\/preview\//);
});
