import { trpcMsw } from "@/client/__mocks__/trpc";
import { UserDetailPage } from "@/client/pageComponents/UserDetailPage/UserDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import {
  DevelopmentHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ユーザーの詳細",
  component: UserDetailPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
  args: { user: UserHelper.create() },
} satisfies Meta<typeof UserDetailPage>;
export default meta;

const baseHandlers = [
  trpcMsw.session.query((req, res, ctx) => {
    return res(ctx.status(200), ctx.data(null));
  }),
  trpcMsw.user.isFavoritedByLoggedInUser.query((req, res, ctx) => {
    return res(ctx.status(200), ctx.data(false));
  }),
  trpcMsw.user.getFavoriteCountByUser.query((req, res, ctx) => {
    return res(ctx.status(200), ctx.data(8));
  }),
  trpcMsw.user.getReceivedLikeCount.query((req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.data({ ideaLikeCount: 10, developmentLikeCount: 2 })
    );
  }),
  trpcMsw.user.getUserActivity.query((req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.data({ developmentCount: 3, likedIdeaCount: 4, postedIdeaCount: 1 })
    );
  }),
];

type Story = StoryObj<typeof meta>;
export const PostedIdeas: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "postedIdeas" } } },
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.idea.getPostedIdeasByUser.query((req, res, ctx) => {
          const { create } = IdeaHelper;
          return res(
            ctx.status(200),
            ctx.data({ list: [create(), create(), create()], allPages: 1 })
          );
        }),
      ],
    },
  },
};

export const Developments: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "developments" } } },
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.development.getDevelopmentsByUser.query((req, res, ctx) => {
          const { create } = DevelopmentHelper;
          return res(
            ctx.status(200),
            ctx.data({
              list: [create(), create(), create()],
              allPages: 1,
            })
          );
        }),
      ],
    },
  },
};

export const LikedIdeas: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "likedIdeas" } } },
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.idea.getLikedIdeasByUser.query((req, res, ctx) => {
          const { create } = IdeaHelper;
          return res(
            ctx.status(200),
            ctx.data({ list: [create(), create(), create()], allPages: 1 })
          );
        }),
      ],
    },
  },
};

export const LikedDevelopments: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "likedDevelopments" } } },
    msw: {
      handlers: [
        ...baseHandlers,
        trpcMsw.development.getLikedDevelopmentsByUser.query(
          (req, res, ctx) => {
            const { create } = DevelopmentHelper;
            return res(
              ctx.status(200),
              ctx.data({ list: [create(), create(), create()], allPages: 1 })
            );
          }
        ),
      ],
    },
  },
};
