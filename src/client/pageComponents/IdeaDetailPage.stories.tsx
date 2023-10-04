import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaDetailPage } from "@/client/pageComponents/IdeaDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import {
  IdeaCommentHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の詳細",
  component: IdeaDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
} satisfies Meta<typeof IdeaDetailPage>;
export default meta;

type Story = StoryObj<typeof meta>;

const ideaExample = IdeaHelper.create({
  title: "TwitterのようなWebアプリケーション",
  likes: 10,
  developments: 3,
  descriptionHtml: "TwitterのようなWebアプリケーション",
});

const baseHandlers = [
  trpcMsw.ideaComment.getAll.query((req, res, ctx) => {
    const { create } = IdeaCommentHelper;
    return res(
      ctx.status(200),
      ctx.data([
        create({ inReplyToComment: undefined }),
        create({ text: "返信コメント1" }),
        create({ text: "返信コメント2" }),
      ])
    );
  }),
];

export const Guest: Story = {
  name: "未ログイン",
  args: { idea: ideaExample },
  parameters: {
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.idea.isLikedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(false));
        }),
        trpcMsw.development.isDevelopedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ developed: false }));
        }),
      ],
    },
  },
};

// TODO: 一番下のコメントまでスクロールしてしまう
// (参考: useAutoScrollOnIncrease)
export const SignedIn: Story = {
  name: "ログイン",
  args: { idea: ideaExample },
  parameters: {
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ expires: "", user: UserHelper.create() })
          );
        }),
        trpcMsw.me.getMySummary.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ allLikes: 10, developments: 3, ideas: 1 })
          );
        }),
        trpcMsw.idea.isLikedByUser.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(true));
        }),
        trpcMsw.development.isDevelopedByUser.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ developed: true, developmentId: "id" })
          );
        }),
      ],
    },
  },
};
