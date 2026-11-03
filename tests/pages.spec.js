// @ts-check
const { test, expect } = require("./fixtures");

const PAGES = [
  { path: "index.html", heading: "すべての人が心と体の健やかさを育み" },
  { path: "activities.html" },
  { path: "report.html" },
  { path: "report-2025.html" },
  { path: "support.html" },
  { path: "sponsors.html" },
  { path: "contact.html" },
  { path: "admin.html" },
];

for (const { path, heading } of PAGES) {
  test.describe(path, () => {
    test("エラーなく表示され、ヘッダーとフッターが読み込まれる", async ({ page, siteErrors }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/NPO法人咲良/);
      if (heading) {
        await expect(page.getByRole("heading", { level: 2 }).first()).toContainText(heading);
      }

      // header.html / footer.html は include.js で後から差し込まれる
      await expect(page.locator("#header .logo")).toHaveText("NPO法人咲良");
      await expect(page.locator("#footer")).not.toBeEmpty();

      await page.waitForLoadState("networkidle");
      expect(siteErrors).toEqual([]);
    });

    test("画像がすべて読み込める", async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // 遅延読み込みの画像も確認するため、最後までスクロールする
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle");

      const broken = await page.locator("img").evaluateAll((imgs) =>
        imgs
          .filter((img) => /** @type {HTMLImageElement} */ (img).naturalWidth === 0)
          .map((img) => img.getAttribute("src"))
      );
      expect(broken, "表示できない画像").toEqual([]);
    });

    test("サイト内リンクの行き先が存在する", async ({ page, request }) => {
      await page.goto(path);
      await expect(page.locator("#footer")).not.toBeEmpty();

      const hrefs = await page.locator("a[href]").evaluateAll((links) =>
        links.map((a) => a.getAttribute("href") || "")
      );
      const internal = [
        ...new Set(
          hrefs
            .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h))
            .map((h) => h.split("#")[0])
            .filter(Boolean)
        ),
      ];

      for (const href of internal) {
        const res = await request.get(href);
        expect(res.status(), `リンク切れ: ${href}`).toBe(200);
      }
    });
  });
}
