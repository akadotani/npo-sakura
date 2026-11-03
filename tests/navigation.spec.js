// @ts-check
const { test, expect } = require("./fixtures");

test("ナビゲーションの各リンクで目的のページに移動できる", async ({ page, isMobile }) => {
  await page.goto("index.html");
  const nav = page.locator("#nav");
  await expect(nav.getByRole("link")).toHaveCount(7);

  const targets = [
    { name: "活動内容", url: /activities\.html$/ },
    { name: "活動報告", url: /report\.html$/ },
    { name: "応援", url: /support\.html$/ },
    { name: "協賛", url: /sponsors\.html$/ },
    { name: "お問い合わせ", url: /contact\.html$/ },
    { name: "ホーム", url: /index\.html$/ },
  ];

  for (const { name, url } of targets) {
    if (isMobile) await page.locator("#hamburger").click();
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(url);
  }
});

test.describe("スマホ表示", () => {
  test.skip(({ isMobile }) => !isMobile, "スマホ表示のみ");

  test("ハンバーガーメニューで開閉できる", async ({ page }) => {
    await page.goto("index.html");
    const hamburger = page.locator("#hamburger");
    const nav = page.locator("#nav");

    await expect(hamburger).toBeVisible();
    await expect(nav).not.toHaveClass(/open/);

    await hamburger.click();
    await expect(nav).toHaveClass(/open/);
    await expect(nav.getByRole("link", { name: "お問い合わせ" })).toBeVisible();

    await hamburger.click();
    await expect(nav).not.toHaveClass(/open/);
  });
});
