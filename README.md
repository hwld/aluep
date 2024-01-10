
# Aluep

<img src="https://raw.githubusercontent.com/hwld/aluep/main/.images/aluep.png" alt="screenshot" >

## 概要

Aluep は、アプリケーション案である「アプリ開発のお題」を投稿・検索できる Web アプリケーションです。

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
- [Supabase Database](https://supabase.com/docs/guides/database/overview)

## ディレクトリ構成

<pre>
.
├── .github
│   └── workflows: 📚Github ActionsでのCI/CD
│ 
├── prisma: 📚DBのスキーマやシーディング
│ 
└── src
    ├── client: 📚フロント側のコード
    │   ├── features: 📚機能別のコンポーネントやHooks
    │   ├── lib: 📚汎用的なコード
    │   ├── pageComponents: 📚実際に画面に表示されるページコンポーネント
    │   ├── style: 📚アプリのテーマ
    │   └── ui: 📚汎用的なコンポーネント
    │ 
    ├── models: 📚フロント・サーバー両方で使用されるモデルとそれに関連するデータ
    │ 
    ├── pages: 📚APIの設定や、実際に表示されるページ、SSRなど
    │ 
    ├── server: 📚サーバー側のコード
    │   ├── features: 📚機能別のAPI実装
    │   ├── lib: 📚汎用的なコード
    │   ├── repositories: 📚RDBアクセスとモデルの変換処理など
    │   └── tests: 📚テストの用のヘルパー
    │   
    ├── share: 📚フロント・サーバー両方で使用される一般的なコード
    │ 
    └── types: 📚型定義
</pre>
