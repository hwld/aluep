import { trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaEditPage } from "@/client/pageComponents/IdeaEditPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { IdeaHelper, IdeaTagHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/お題の編集",
  component: IdeaEditPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
} satisfies Meta<typeof IdeaEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { idea: IdeaHelper.create() },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ expires: "", user: UserHelper.create() })
          );
        }),
        trpcMsw.me.getMySummary.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ allLikes: 100, developments: 100, ideas: 100 })
          );
        }),
        trpcMsw.idea.getAllTags.query((req, res, ctx) => {
          const { create } = IdeaTagHelper;
          return res(
            ctx.status(200),
            ctx.data([
              create({ name: "longlonglonglonglonglong" }),
              create({
                name: "長いタグ長いタグ長いタグ長いタグ長いタグ長いタグ",
              }),
              create({ name: "短いタグ" }),
            ])
          );
        }),
      ],
    },
  },
};
