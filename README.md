# アプリ開発のお題投稿サイト

## 使用技術

### 技術

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)
- [Mantine](https://mantine.dev/)
- [NextAuth](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### インフラ

- [Cloud Run](https://cloud.google.com/run?hl=ja)
- [Cloud Storage](https://cloud.google.com/storage?hl=ja)
- [PlanetScale](https://planetscale.com/)

## 開発環境の構築

### 前提
- [Node.js](https://nodejs.org/ja/)がインストールされており、npmコマンドが使用できる。

### 手順
1. プロジェクトのディレクトリを作成したい場所で `git clone https://github.com/te190187/app-theme-post` を実行する。
1. app-theme-post 直下に.env ファイルを作成し、google drive にある.env ファイルというドキュメントの内容をコピーする。必要な環境変数は下記を参照。
1. 作成した app-theme-post ディレクトリに cd し、`npm i`を実行して、必要なライブラリを導入する。
1. `npx prisma db push` を実行し、DB に必要なテーブルを反映させる。
1. `npx prisma db seed` を実行し、初期データを DB に追加する。
1. `npm run dev` でサーバーを立ち上げ、ターミナルに表示されている URL にアクセスする。

手順 6 まで終わった後は、手順 1 で作成したディレクトリの中で`npm run dev`を実行することでサーバーを起動できる。  
`npx prisma studio` を実行することで、ブラウザ上で DB の内容を確認することができる。

GitHub から最新のコミットを取り込んだ後は、ライブラリの追加や DB のスキーマ変更を反映させるため、手順 3 から行う。

### 必要な環境変数
- DATABASE_URL: 
  - MySQLデータベースの接続文字列。ローカルの場合は`"mysql://root@localhost:3306/app_theme_post"`など。
- GITHUB_ID:
  - GitHubログインで必要になるOAuth AppのClient ID。存在しない場合は[ここ](https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)から作成。
- GITHUB_SECRET:
  - GitHubログインで必要になるOAuth AppのClient secrets。存在しない場合は[ここ](https://docs.github.com/ja/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)から作成。
- SLACK_WEBHOOK_URL:
  - 通報先のSlack Webhook URL。slack appが存在しない場合は[ここ](https://api.slack.com/messaging/webhooks)を参考に作成。
- HTTP_PROXY:
  - プロキシ環境下で通報を試したい場合に必要になるプロキシのアドレス。
- NEXT_PUBLIC_CONTACT_URL:
  - お問い合わせの遷移先のURL。Google FormsのURLなど。
- STORAGE_TYPE:
  - プロフィールのアップロードでCloud Storageを使用するか変更するフラグ。使用しない場合は`"local"`を設定する。Cloud Storageが存在する場合は、プロジェクトのルートディレクトリにgcs-key.jsonという名前で、書き込み権限のあるjsonのサービスアカウントキーが必要になる。
## ディレクトリ構成概要

- src/
  - pages/ --- URL にアクセスしたときに実行されるコード
  - client/ --- クライアント側のコード
    - components/ --- React のコンポーネント
    - hooks/ --- React のカスタムフック
  - server --- サーバー側のコード
    - lib/ --- サーバー全体で共有するコード
    - routers/ --- API サーバーのコード

## その他コマンド

- `npx tsc --noEmit`: TypeScript のエラーをチェック
- `npm run create:dummy`: DB にダミーデータの作成
