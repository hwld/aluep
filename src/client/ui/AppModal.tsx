// mantineのmodalはクリックイベントを伝搬させるので、それを止めるための層を追加した

import { stopPropagation } from "@/client/lib/utils";
import { ModalProps, Box, Modal } from "@mantine/core";

// Modalを作成する。
export const AppModal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <Box sx={{ display: "none" }} onClick={stopPropagation}>
      <Modal
        exitTransitionDuration={150}
        overlayOpacity={0.4}
        styles={(theme) => ({
          title: {
            fontSize: theme.fontSizes.xl,
            fontWeight: "bold",
            color: theme.colors.red[7],
          },
          modal: { margin: "auto" },
          root: { zIndex: 10 },
        })}
        {...props}
      >
        {children}
      </Modal>
    </Box>
  );
};
