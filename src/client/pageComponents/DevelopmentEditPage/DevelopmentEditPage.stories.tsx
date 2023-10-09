import { DevelopmentEditPage } from "@/client/pageComponents/DevelopmentEditPage/DevelopmentEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import {
  DevelopmentHelper,
  IdeaHelper,
  SampleDevStatuses,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/開発情報の編集",
  component: DevelopmentEditPage,
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
} satisfies Meta<typeof DevelopmentEditPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    idea: IdeaHelper.createFilled(),
    development: DevelopmentHelper.createFilled(),
    restoredValues: {},
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: false,
        }),
        mockTrpcQuery(
          trpcMsw.development.getDevelopmentStatuses,
          SampleDevStatuses
        ),
      ],
    },
  },
};
