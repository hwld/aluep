import { DevEditPage } from "@/client/pageComponents/DevEditPage/DevEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の編集",
  component: DevEditPage,
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
} satisfies Meta<typeof DevEditPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    idea: IdeaHelper.createFilled(),
    dev: DevHelper.createFilled(),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.dev.isDevelopedByUser, {
          developed: false,
        }),
      ],
    },
  },
};
