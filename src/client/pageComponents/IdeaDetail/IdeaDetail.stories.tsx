import { IdeaDetail } from "@/client/pageComponents/IdeaDetail/IdeaDetail";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import {
  IdeaCommentHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の詳細",
  component: IdeaDetail,
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
} satisfies Meta<typeof IdeaDetail>;
export default meta;

type Story = StoryObj<typeof meta>;

const ideaSample = IdeaHelper.create({
  title: "TwitterのようなWebアプリケーション",
  likes: 10,
  devs: 3,
});

export const Filled: Story = {
  name: "アルファベットのみ",
  args: {
    idea: IdeaHelper.create({ descriptionHtml: faker.string.alpha(2000) }),
  },
};

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
      ],
    },
  },
};

// 一番下のコメントまでスクロールしてしまう
// useAutoScrollOnIncreaseは、前のレンダリングのコメントの数と比較するから、
// SSRを使わない場合は初回のレンダリングのコメントは常に0なので、読み込まれた時点でスクロールする
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
      ],
    },
  },
};

export const EmptyComment: Story = {
  name: "コメントなし",
  args: { idea: ideaSample },
};
