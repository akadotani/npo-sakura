import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabaseConfig } from "./supabase-config.js";

function setMessage(id, message, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", Boolean(isError));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("admin-login-form");
  const panel = document.getElementById("admin-panel");
  const tableBody = document.getElementById("admin-contacts-body");
  const signOutButton = document.getElementById("admin-signout");

  if (!loginForm || !panel || !tableBody || !signOutButton) return;

  if (!hasSupabaseConfig()) {
    setMessage("admin-login-status", "Supabase設定が未完了です。", true);
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function loadContacts() {
    setMessage("admin-panel-status", "読み込み中...");
    const { data, error } = await supabase
      .from("contacts")
      .select("created_at,name,email,message")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setMessage("admin-panel-status", "データ取得に失敗しました。", true);
      tableBody.innerHTML = "";
      return;
    }

    if (!data || data.length === 0) {
      setMessage("admin-panel-status", "問い合わせはまだありません。");
      tableBody.innerHTML = "";
      return;
    }

    tableBody.innerHTML = data
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(formatDate(row.created_at))}</td>
            <td>${escapeHtml(row.name)}</td>
            <td>${escapeHtml(row.email)}</td>
            <td class="admin-message-cell">${escapeHtml(row.message)}</td>
          </tr>
        `
      )
      .join("");

    setMessage("admin-panel-status", `${data.length}件を表示中`);
  }

  async function refreshAuthState() {
    const { data } = await supabase.auth.getSession();
    const isLoggedIn = Boolean(data.session);
    loginForm.hidden = isLoggedIn;
    panel.hidden = !isLoggedIn;
    if (isLoggedIn) {
      setMessage("admin-login-status", "");
      await loadContacts();
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    setMessage("admin-login-status", "ログイン中...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("admin-login-status", "ログインに失敗しました。", true);
      return;
    }

    await refreshAuthState();
  });

  signOutButton.addEventListener("click", async () => {
    await supabase.auth.signOut();
    tableBody.innerHTML = "";
    panel.hidden = true;
    loginForm.hidden = false;
    setMessage("admin-login-status", "ログアウトしました。");
  });

  refreshAuthState();
});
