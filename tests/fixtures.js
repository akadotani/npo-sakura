// @ts-check
const base = require("@playwright/test");

// 外部サイトには一切アクセスせず、Supabase クライアントは偽物に差し替える。
// これにより本番の Supabase にデータが送られることはない。
const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_STUB = `
export function createClient() {
  const state = (window.__supabaseStub ||= { inserts: [], insertError: null });
  return {
    from(table) {
      return {
        async insert(row) {
          state.inserts.push({ table, row });
          return { error: state.insertError };
        },
      };
    },
    auth: {
      async getSession() { return { data: { session: null } }; },
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
      async signInWithPassword() { return { error: { message: "stub" } }; },
      async signOut() { return { error: null }; },
    },
  };
}
`;

// デプロイ時に生成される設定ファイル。テストでは既定で「未設定」にしておく。
const UNCONFIGURED = "window.__APP_CONFIG__ = {};";
const CONFIGURED = `window.__APP_CONFIG__ = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "test-anon-key"
};`;

exports.test = base.test.extend({
  /** true にすると Supabase 設定済みの状態でページを開く */
  supabaseConfigured: [false, { option: true }],

  page: async ({ page, baseURL, supabaseConfigured }, use) => {
    const origin = new URL(/** @type {string} */ (baseURL)).origin;

    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (url === SUPABASE_CDN) {
        return route.fulfill({ contentType: "text/javascript", body: SUPABASE_STUB });
      }
      if (url.startsWith(`${origin}/assets/js/runtime-config.js`)) {
        return route.fulfill({
          contentType: "text/javascript",
          body: supabaseConfigured ? CONFIGURED : UNCONFIGURED,
        });
      }
      if (!url.startsWith(origin)) return route.abort();
      return route.continue();
    });

    await use(page);
  },

  /** ページ内の JavaScript エラーと、サイト内ファイルの読み込み失敗を集める */
  siteErrors: async ({ page, baseURL }, use) => {
    const origin = new URL(/** @type {string} */ (baseURL)).origin;
    /** @type {string[]} */
    const errors = [];
    page.on("pageerror", (err) => errors.push(`JSエラー: ${err.message}`));
    page.on("response", (res) => {
      if (res.url().startsWith(origin) && res.status() >= 400) {
        errors.push(`${res.status()}: ${res.url().replace(origin, "")}`);
      }
    });
    await use(errors);
  },
});

exports.expect = base.expect;
