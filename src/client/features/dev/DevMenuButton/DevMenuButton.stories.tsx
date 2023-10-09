import { DevMenuButton } from "@/client/features/dev/DevMenuButton/DevMenuButton";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMenuButton } satisfies Meta<typeof DevMenuButton>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { development: DevelopmentHelper.create(), isOwner: false },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
          developed: false,
        }),
      ],
    },
  },
};
