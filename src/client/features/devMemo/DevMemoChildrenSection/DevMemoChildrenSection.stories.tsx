import { trpcMsw } from "@/client/__mocks__/trpc";
import { DevMemoChildrenSection } from "@/client/features/devMemo/DevMemoChildrenSection/DevMemoChildrenSection";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoChildrenSection } satisfies Meta<
  typeof DevMemoChildrenSection
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    developmentId: "",
    childMemos: [...new Array(3)].map(() => DevelopmentMemoHelper.create()),
    isOpenReplyForm: true,
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
