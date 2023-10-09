import { IdeaDetailPage } from "@/client/pageComponents/IdeaDetailPage/IdeaDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
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

const ideaSample = IdeaHelper.create({
  title: "TwitterのようなWebアプリケーション",
  likes: 10,
  developments: 3,
});

export const Guest: Story = {
  name: "未ログイン",
  args: { idea: ideaSample },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.ideaComment.getAll, () => {
          const { create } = IdeaCommentHelper;
          return [
            create({ inReplyToComment: undefined }),
            create({ text: "返信コメント1" }),
            create({ text: "返信コメント2" }),
          ];
        }),
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.idea.isLikedByUser, false),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: false,
        }),
      ],
    },
  },
};

// TODO: 一番下のコメントまでスクロールしてしまう
// (参考: useAutoScrollOnIncrease)
export const SignedIn: Story = {
  name: "ログイン",
  args: { idea: ideaSample },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.ideaComment.getAll, () => {
          const { create } = IdeaCommentHelper;
          return [
            create({ inReplyToComment: undefined }),
            create({ text: "返信コメント1" }),
            create({ text: "返信コメント2" }),
          ];
        }),
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.create(),
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 10,
          developments: 3,
          ideas: 1,
        }),
        mockTrpcQuery(trpcMsw.idea.isLikedByUser, true),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: true,
          developmentId: "id",
        }),
      ],
    },
  },
};

export const EmptyComment: Story = {
  name: "コメントなし",
  args: { idea: ideaSample },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.ideaComment.getAll, []),
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.create(),
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 10,
          developments: 3,
          ideas: 1,
        }),
        mockTrpcQuery(trpcMsw.idea.isLikedByUser, true),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: true,
          developmentId: "id",
        }),
      ],
    },
  },
};
