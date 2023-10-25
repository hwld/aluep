import { DevLikersPage } from "@/client/pageComponents/DevLikersPage/DevLikersPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper, DevLikerHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報をいいねしたユーザー",
  component: DevLikersPage,
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
} satisfies Meta<typeof DevLikersPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { dev: DevHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getDevLikers, {
          list: [...new Array(3)].map(() => DevLikerHelper.create()),
          allPages: 1,
        }),
      ],
    },
  },
};

export const Filled: Story = {
  args: { dev: DevHelper.createFilled() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getDevLikers, {
          list: [...new Array(9)].map(() => DevLikerHelper.createFilled()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const DeletedIdea: Story = {
  args: { dev: DevHelper.create({ idea: null }) },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getDevLikers, {
          list: [...new Array(3)].map(() => DevLikerHelper.create()),
          allPages: 1,
        }),
      ],
    },
  },
};
