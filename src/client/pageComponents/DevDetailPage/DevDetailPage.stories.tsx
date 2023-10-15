import { DevDetailPage } from "@/client/pageComponents/DevDetailPage/DevDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import {
  DevHelper,
  DevMemoHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の詳細",
  component: DevDetailPage,
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
} satisfies Meta<typeof DevDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const me = UserHelper.create();
export const Me: Story = {
  args: {
    idea: IdeaHelper.create(),
    dev: DevHelper.create({
      developer: { id: me.id, name: me.name, imageUrl: "" },
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
          devs: 1,
          ideas: 1,
        }),
        mockTrpcQuery(trpcMsw.devMemo.getAll, []),
      ],
    },
  },
};

export const EmptyMemo: Story = {
  args: { idea: IdeaHelper.create(), dev: DevHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.devMemo.getAll, []),
      ],
    },
  },
};

export const FilledMemos: Story = {
  args: {
    idea: IdeaHelper.createFilled(),
    dev: DevHelper.createFilled(),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.devMemo.getAll, [
          DevMemoHelper.createFilled(),
          DevMemoHelper.createFilled(),
        ]),
      ],
    },
  },
};
