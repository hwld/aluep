import { UserDetailPage } from "@/client/pageComponents/UserDetailPage/UserDetailPage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevHelper, IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { UserDetailPageTab } from "@/models/user";
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
    devLikeCount: 2,
  }),
  mockTrpcQuery(trpcMsw.user.getUserActivity, {
    devCount: 3,
    likedIdeaCount: 4,
    postedIdeaCount: 1,
  }),
];

type Story = StoryObj<typeof meta>;
export const PostedIdeas: Story = {
  parameters: {
    nextjs: {
      router: { query: { tab: "postedIdeas" satisfies UserDetailPageTab } },
    },
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

export const Devs: Story = {
  parameters: {
    nextjs: { router: { query: { tab: "devs" satisfies UserDetailPageTab } } },
    msw: {
      handlers: [
        ...baseHandlers,
        mockTrpcQuery(trpcMsw.dev.getDevsByUser, {
          list: [...new Array(10)].map(() => DevHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const LikedIdeas: Story = {
  parameters: {
    nextjs: {
      router: { query: { tab: "likedIdeas" satisfies UserDetailPageTab } },
    },
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

export const LikedDevs: Story = {
  parameters: {
    nextjs: {
      router: { query: { tab: "likedDevs" satisfies UserDetailPageTab } },
    },
    msw: {
      handlers: [
        ...baseHandlers,
        mockTrpcQuery(trpcMsw.dev.getLikedDevsByUser, {
          list: [...new Array(10)].map(() => DevHelper.create()),
          allPages: 2,
        }),
      ],
    },
  },
};

export const LikedDevsFilled: Story = {
  parameters: {
    nextjs: {
      router: { query: { tab: "likedDevs" satisfies UserDetailPageTab } },
    },
    msw: {
      handlers: [
        ...baseHandlers,
        mockTrpcQuery(trpcMsw.dev.getLikedDevsByUser, {
          list: [...new Array(10)].map(() => DevHelper.createFilled()),
          allPages: 2,
        }),
      ],
    },
  },
};
