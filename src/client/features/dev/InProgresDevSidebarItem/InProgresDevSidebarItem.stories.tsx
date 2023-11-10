import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { InProgresDevSidebarItem } from "./InProgresDevSidebarItem";

const meta = {
  component: InProgresDevSidebarItem,
} satisfies Meta<typeof InProgresDevSidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.dev.getInProgresDevsByUser, [
          ...[...new Array(100)].map(() => DevHelper.create()),
        ]),
      ],
    },
  },
  args: { tooltip: true, loggedInUserId: "user-id" },
};

export const Empty: Story = {
  args: { tooltip: true, loggedInUserId: "user-id" },
};
