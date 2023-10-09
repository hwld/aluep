import { DevelopmentDetailPage } from "@/client/pageComponents/DevelopmentDetailPage/DevelopmentDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import {
  DevelopmentHelper,
  DevelopmentMemoHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の詳細",
  component: DevelopmentDetailPage,
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
} satisfies Meta<typeof DevelopmentDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const me = UserHelper.create();
export const Me: Story = {
  args: {
    idea: IdeaHelper.create(),
    development: DevelopmentHelper.create({
      developerUserId: me.id,
      developerUserName: me.name,
    }),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, {
          user: me,
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 1,
          developments: 1,
          ideas: 1,
        }),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: true,
          developmentId: "",
        }),
        mockTrpcQuery(trpcMsw.developmentMemo.getAll, []),
      ],
    },
  },
};

export const EmptyMemo: Story = {
  args: { idea: IdeaHelper.create(), development: DevelopmentHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: false,
        }),
        mockTrpcQuery(trpcMsw.developmentMemo.getAll, []),
      ],
    },
  },
};

export const FilledMemos: Story = {
  args: {
    idea: IdeaHelper.createFilled(),
    development: DevelopmentHelper.createFilled(),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: false,
        }),
        mockTrpcQuery(trpcMsw.developmentMemo.getAll, [
          DevelopmentMemoHelper.createFilled(),
          DevelopmentMemoHelper.createFilled(),
        ]),
      ],
    },
  },
};
