import { DevelopmentLikersPage } from "@/client/pageComponents/DevelopmentLikersPage/DevelopmentLikersPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import {
  DevelopmentHelper,
  DevelopmentLikerHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報をいいねしたユーザー",
  component: DevelopmentLikersPage,
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
} satisfies Meta<typeof DevelopmentLikersPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { development: DevelopmentHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getDevelopmentLikers, {
          list: [...new Array(3)].map(() => DevelopmentLikerHelper.create()),
          allPages: 1,
        }),
      ],
    },
  },
};
