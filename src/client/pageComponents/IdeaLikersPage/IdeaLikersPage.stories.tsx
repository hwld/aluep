import { IdeaLikersPage } from "@/client/pageComponents/IdeaLikersPage/IdeaLikersPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題をいいねしたユーザー",
  component: IdeaLikersPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
} satisfies Meta<typeof IdeaLikersPage>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.user.getIdeaLikers, {
          list: [...new Array(3)].map(() => ({
            ...UserHelper.create(),
            likedDate: new Date(),
          })),
          allPages: 1,
        }),
      ],
    },
  },
};
