import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevDetailCard } satisfies Meta<typeof DevDetailCard>;
export default meta;

type Story = StoryObj<typeof meta>;

const baseHandlers = [mockTrpcQuery(trpcMsw.session, null)];

export const Default: Story = {
  args: {
    dev: DevHelper.create(),
    isDeveloper: false,
  },
  parameters: {
    msw: {
      handlers: [...baseHandlers],
    },
  },
};

export const Filled: Story = {
  args: {
    dev: DevHelper.createFilled(),
    isDeveloper: false,
  },
  parameters: {
    msw: {
      handlers: [...baseHandlers],
    },
  },
};
