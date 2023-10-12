import { IdeaInfoCardItem } from "@/client/features/idea/IdeaInfoCardItem/IdeaInfoCardItem";
import { Text } from "@mantine/core";
import { Meta, StoryObj } from "@storybook/react";
import { MdPerson } from "react-icons/md";

const meta = { component: IdeaInfoCardItem } satisfies Meta<
  typeof IdeaInfoCardItem
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: <Text>ユーザー名</Text>,
    icon: <MdPerson size={30} />,
    title: "ユーザー",
  },
};
