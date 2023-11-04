import { IdeaLikers } from "@/client/pageComponents/IdeaLikers/IdeaLikers";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題をいいねしたユーザー",
  component: IdeaLikers,
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
} satisfies Meta<typeof IdeaLikers>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.createFilled() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.user.getIdeaLikers, {
          list: [...new Array(10)].map(() => ({
            ...UserHelper.createFilled(),
            likedDate: new Date(),
          })),
          allPages: 2,
        }),
      ],
    },
  },
};
