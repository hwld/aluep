import { trpcMsw } from "@/client/__mocks__/trpc";
import { ChildDevelopmentMemoSection } from "@/client/features/developmentMemo/DevelopmentMemoChildrenSection/DevelopmentMemoChildrenSection";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: ChildDevelopmentMemoSection } satisfies Meta<
  typeof ChildDevelopmentMemoSection
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
