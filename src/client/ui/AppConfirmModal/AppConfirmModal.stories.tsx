import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { Meta, StoryObj } from "@storybook/react";
import { MdComputer } from "react-icons/md";

const meta = { component: AppConfirmModal } satisfies Meta<
  typeof AppConfirmModal
>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    opened: true,
    title: "確認モーダル",
    message: "続けますか？",
    isConfirming: false,
    confirmIcon: MdComputer,
    confirmText: "確認",
  },
};
