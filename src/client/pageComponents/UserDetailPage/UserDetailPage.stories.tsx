import { UserDetailPage } from "@/client/pageComponents/UserDetailPage/UserDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
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
  mockTrpcQuery(trpcMsw.session, null),
  mockTrpcQuery(trpcMsw.user.isFavoritedByLoggedInUser, false),
  mockTrpcQuery(trpcMsw.user.getFavoriteCountByUser, 8),
  mockTrpcQuery(trpcMsw.user.getReceivedLikeCount, {
    ideaLikeCount: 10,
    developmentLikeCount: 2,
  }),
  mockTrpcQuery(trpcMsw.user.getUserActivity, {
    developmentCount: 3,
    likedIdeaCount: 4,
    postedIdeaCount: 1,
  }),
];

type Story = StoryObj<typeof meta>;
export const PostedIdeas: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "postedIdeas" } } },
    msw: {
      handlers: [
        ...baseHandlers,
        mockTrpcQuery(trpcMsw.idea.getPostedIdeasByUser, {
          list: [...new Array(10)].map(() => IdeaHelper.create()),
          allPages: 2,
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
        mockTrpcQuery(trpcMsw.development.getDevelopmentsByUser, {
          list: [...new Array(10)].map(() => DevelopmentHelper.create()),
          allPages: 2,
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
        mockTrpcQuery(trpcMsw.idea.getLikedIdeasByUser, {
          list: [...new Array(10)].map(() => IdeaHelper.create()),
          allPages: 2,
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
        mockTrpcQuery(trpcMsw.development.getLikedDevelopmentsByUser, {
          list: [...new Array(10)].map(() => DevelopmentHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};
