import { LoggedInUserCard } from "@/client/ui/LoggedInUserCard/LoggedInUserCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: LoggedInUserCard } satisfies Meta<
  typeof LoggedInUserCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { user: UserHelper.create(), iconWidth: 40 },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          ideas: 10,
          allLikes: 5,
          devs: 0,
        }),
      ],
    },
  },
};
