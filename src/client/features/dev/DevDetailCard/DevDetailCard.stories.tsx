import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevDetailCard } satisfies Meta<typeof DevDetailCard>;
export default meta;

type Story = StoryObj<typeof meta>;

const baseHandlers = [
  mockTrpcQuery(trpcMsw.session, null),
  mockTrpcQuery(trpcMsw.development.isDevelopedByUser, {
    developed: false,
  }),
];

export const Default: Story = {
  args: {
    development: DevelopmentHelper.create(),
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
    development: DevelopmentHelper.createFilled(),
    isDeveloper: false,
  },
  parameters: {
    msw: {
      handlers: [...baseHandlers],
    },
  },
};
