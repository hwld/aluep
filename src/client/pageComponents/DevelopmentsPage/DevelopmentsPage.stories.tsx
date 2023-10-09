import { DevelopmentsPage } from "@/client/pageComponents/DevelopmentsPage/DevelopmentsPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の一覧",
  component: DevelopmentsPage,
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
} satisfies Meta<typeof DevelopmentsPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: { idea: IdeaHelper.createFilled() },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.development.getManyByIdea, {
          list: [...new Array(10)].map(() => DevelopmentHelper.createFilled()),
          allPages: 2,
        }),
      ],
    },
  },
};
