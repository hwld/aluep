import { UserSearchResultContent } from "@/client/features/user/UserSearchResultContent/UserSearchResultContent";
import { UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: UserSearchResultContent } satisfies Meta<
  typeof UserSearchResultContent
>;
export default meta;

type Story = StoryObj<typeof meta>;

const { create } = UserHelper;
export const Default: Story = {
  args: {
    userSearchResult: [...new Array(6)].map(() => create()),
    isEmptyKeyword: false,
  },
};
