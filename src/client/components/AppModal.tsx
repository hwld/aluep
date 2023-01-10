import { Box, Modal, ModalProps } from "@mantine/core";
import { stopPropagation } from "../utils";

// mantineのmodalはクリックイベントを伝搬させるので、それを止めるための層を追加した
// Modalを作成する。
export const AppModal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <Box sx={{ display: "none" }} onClick={stopPropagation}>
      <Modal
        exitTransitionDuration={150}
        styles={(theme) => ({
          title: {
            fontSize: theme.fontSizes.xl,
            fontWeight: "bold",
            color: theme.colors.red[7],
          },
          modal: { margin: "auto" },
          root: { zIndex: 100000 },
        })}
        {...props}
      >
        {children}
      </Modal>
    </Box>
  );
};
