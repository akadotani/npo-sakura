# NPO法人咲良 サイト開発ルール

## ブランチ運用

新しい作業を始めるときは、必ず以下を確認すること：

1. 現在のブランチが既にマージ済みかどうか確認する
   ```bash
   git branch -r --merged origin/main
   ```
2. マージ済みの場合は、最新の main から新しいブランチを切る
   ```bash
   git fetch origin
   git checkout -b feature/<作業内容> origin/main
   ```
3. 作業ごとに別ブランチ・別PRにする（1つのPRに複数の独立した変更を混在させない）

## PRのマージ方法

- マージ方法は **squash のみ**（リポジトリの設定による）
- `merge commits` は使用不可

## 年度・日付表記

- 年度・日付の表記は**西暦に統一**する（和暦・元号は使わない）
- 例：「令和7年度」ではなく「2025年度」

## 画像ファイルの命名規則

- iPhoneなどから追加するとUUID形式のファイル名になるため、必ずリネームしてからコミットする
- 命名形式：`YYYY_<内容>_<連番>.jpg`
- 例：`2026_undoukai_01.jpg`、`2026_undoukai_staff.jpg`

## 協賛ページの更新

- 年度が変わったら `sponsors.html` の以下を更新する
  - ページ内の年度表記（例：「2026年度 協賛企業・団体」）
  - 協賛企業・団体のリスト
- 掲載順は**五十音順**（「株式会社」等を除いた名称基準、敬称略）

## 同梱している supabase-js の更新

`assets/vendor/supabase-js/<版>/` の supabase-js はリポジトリに同梱しているため、**Dependabot の更新とアラートの対象外**です。手動で更新してください。

- 時期：半年に1回程度、または重大な脆弱性が公表されたとき
- 現在の版：2.117.2（2026-11 に導入）

手順：

1. `npm view @supabase/supabase-js time --json` で版を確認し、公開から2週間以上経った版を選ぶ
2. 空の作業用フォルダで `npm pack @supabase/supabase-js@<版>` を実行し、取得物のハッシュを `npm view @supabase/supabase-js@<版> dist.integrity` と照合する
3. `package/dist/umd/supabase.js` と `package/LICENSE` を `assets/vendor/supabase-js/<版>/` に置き、古い版のフォルダを削除する
4. `contact.html` の読み込みパスと、この節の「現在の版」を更新する
5. `npm test` を実行する。問い合わせフォームは実際に1件送り、通知メールまで確認する

`supabase-infra` の Edge Function（`contact-submit/index.ts`）も同じ版に固定しています。あわせて更新し、テスト環境で確認してから本番にデプロイしてください。
