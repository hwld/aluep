import { DevCard } from "@/client/features/dev/DevCard/DevCard";
import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentHelper, IdeaHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevCard } satisfies Meta<typeof DevCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { idea: IdeaHelper.create(), development: DevelopmentHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
      ],
    },
  },
};
