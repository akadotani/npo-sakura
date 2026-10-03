// @ts-check
const { test, expect } = require("./fixtures");

/** @param {import("@playwright/test").Page} page */
async function fillForm(page) {
  await page.getByLabel("お名前").fill("テスト 太郎");
  await page.getByLabel("メールアドレス").fill("test@example.com");
  await page.getByLabel("お問い合わせ内容").fill("テスト送信です。");
}

/** @param {import("@playwright/test").Page} page */
function inserts(page) {
  return page.evaluate(() => window.__supabaseStub?.inserts ?? []);
}

test("Supabase の設定がないときは、その旨を表示する", async ({ page }) => {
  await page.goto("contact.html");
  await expect(page.locator("#contact-status")).toHaveText(
    "フォーム設定が未完了です。管理者にご連絡ください。"
  );
});

test.describe("Supabase 設定済み", () => {
  test.use({ supabaseConfigured: true });

  test("入力して送信すると受付メッセージが出て、フォームが空になる", async ({ page }) => {
    await page.goto("contact.html");
    await fillForm(page);
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.locator("#contact-status")).toHaveText(
      "送信ありがとうございました。内容を受け付けました。"
    );
    await expect(page.getByLabel("お名前")).toHaveValue("");
    expect(await inserts(page)).toEqual([
      {
        table: "contacts",
        row: { name: "テスト 太郎", email: "test@example.com", message: "テスト送信です。" },
      },
    ]);
  });

  test("必須項目が空だと送信されない", async ({ page }) => {
    await page.goto("contact.html");
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.getByLabel("お名前")).toHaveJSProperty("validity.valueMissing", true);
    expect(await inserts(page)).toEqual([]);
  });

  test("保存に失敗したときはエラーを表示し、入力内容を残す", async ({ page }) => {
    await page.addInitScript(() => {
      window.__supabaseStub = { inserts: [], insertError: { message: "boom" } };
    });
    await page.goto("contact.html");
    await fillForm(page);
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.locator("#contact-status")).toHaveText(
      "送信に失敗しました。時間をおいて再度お試しください。"
    );
    await expect(page.getByLabel("お名前")).toHaveValue("テスト 太郎");
    await expect(page.getByRole("button", { name: "送信する" })).toBeEnabled();
  });

  test("スパム対策の隠し項目が入力されていたら送信しない", async ({ page }) => {
    await page.goto("contact.html");
    await fillForm(page);
    await page.locator("#contact-website").evaluate((el) => {
      /** @type {HTMLInputElement} */ (el).value = "https://spam.example";
    });
    await page.getByRole("button", { name: "送信する" }).click();

    await expect(page.locator("#contact-status")).toHaveText("");
    expect(await inserts(page)).toEqual([]);
  });
});
