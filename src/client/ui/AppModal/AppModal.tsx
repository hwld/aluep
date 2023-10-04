// mantineのmodalはクリックイベントを伝搬させるので、それを止めるための層を追加した

import { stopPropagation } from "@/client/lib/utils";
import { Box, Modal, ModalProps } from "@mantine/core";
import classes from "./AppModal.module.css";

// Modalを作成する。
export const AppModal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <Box style={{ display: "none" }} onClick={stopPropagation}>
      <Modal
        centered
        transitionProps={{ exitDuration: 150 }}
        overlayProps={{ backgroundOpacity: 0.4 }}
        classNames={{
          root: classes.root,
          title: classes.title,
          header: classes.header,
          close: classes.close,
        }}
        {...props}
      >
        {children}
      </Modal>
    </Box>
  );
};
