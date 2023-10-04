import { RequireLoginModal } from "@/client/features/session/RequireLoginModal/RequireLoginModal";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: RequireLoginModal } satisfies Meta<
  typeof RequireLoginModal
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  decorators: [
    (Story) => {
      const { openLoginModal } = useRequireLoginModal();

      return (
        <div>
          <button onClick={() => openLoginModal()}>open</button>
          <Story />
        </div>
      );
    },
  ],
};
