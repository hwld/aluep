import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { DevInProgresSidebarItem } from "./InProgresDevSidebarItem";

const meta = {
  component: DevInProgresSidebarItem,
} satisfies Meta<typeof DevInProgresSidebarItem>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.dev.getInProgresDevsByUser, [DevHelper.create()]),
      ],
    },
  },
  args: { tooltip: true, loggedInUserId: "user-id" },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [mockTrpcQuery(trpcMsw.dev.getInProgresDevsByUser, [])],
    },
  },
  args: { tooltip: true, loggedInUserId: "user-id" },
};
