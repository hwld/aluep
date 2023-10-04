import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentMemoChild } from "@/client/features/developmentMemo/DevelopmentMemoChild/DevelopmentMemoChild";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopmentMemoChild } satisfies Meta<
  typeof DevelopmentMemoChild
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    memo: DevelopmentMemoHelper.create({ id: "memo-id" }),
    developmentId: "",
    ideaId: "",
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
