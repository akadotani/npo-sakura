import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabaseConfig } from "./supabase-config.js";

function setStatus(message, isError) {
  const status = document.getElementById("contact-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-error", Boolean(isError));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  if (!hasSupabaseConfig()) {
    setStatus("フォーム設定が未完了です。管理者にご連絡ください。", true);
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const submitButton = document.getElementById("contact-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const website = form.website.value.trim();

    if (website) return;
    if (!name || !email || !message) {
      setStatus("必須項目を入力してください。", true);
      return;
    }

    if (submitButton) submitButton.disabled = true;
    setStatus("送信中です...");

    const { error } = await supabase.functions.invoke("contact-submit", {
      body: {
        name,
        email,
        message,
        website,
      },
    });

    if (submitButton) submitButton.disabled = false;

    if (error) {
      setStatus("送信に失敗しました。時間をおいて再度お試しください。", true);
      return;
    }

    form.reset();
    setStatus("送信ありがとうございました。内容を受け付けました。");
  });
});
