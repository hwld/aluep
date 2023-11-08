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
        transitionProps={{
          transition: {
            in: { opacity: 1, transform: "translateY(0px)" },
            out: { opacity: 0, transform: "translateY(-30px)" },
            transitionProperty: "opacity,transform",
          },
          timingFunction: "ease-in-out",
          duration: 250,
          exitDuration: 200,
        }}
        overlayProps={{ backgroundOpacity: 0.4 }}
        radius="lg"
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
