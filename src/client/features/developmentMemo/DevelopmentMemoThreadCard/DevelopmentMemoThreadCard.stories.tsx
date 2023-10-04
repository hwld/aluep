import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentMemoThreadCard } from "@/client/features/developmentMemo/DevelopmentMemoThreadCard/DevelopmentMemoThreadCard";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopmentMemoThreadCard } satisfies Meta<
  typeof DevelopmentMemoThreadCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    developmentId: "",
    memo: DevelopmentMemoHelper.create(),
    childrenMemos: [...new Array(5)].map(() => DevelopmentMemoHelper.create()),
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.developmentMemo.getAll.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
