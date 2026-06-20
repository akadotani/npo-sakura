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
