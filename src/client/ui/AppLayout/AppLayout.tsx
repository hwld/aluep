import { RequireLoginModal } from "@/client/features/session/RequireLoginModal/RequireLoginModal";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { AppSidebar } from "@/client/ui/AppSidebar/AppSidebar";
import { Box } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import clsx from "clsx";
import { ReactNode } from "react";
import classes from "./AppLayout.module.css";

type Props = {
  children: ReactNode;
  isSideBarOpen?: boolean | undefined;
  className?: string;
};

export const AppLayout: React.FC<Props> = ({
  children,
  isSideBarOpen,
  className,
}) => {
  const unsupportedDisplay = useMediaQuery("(max-width: 600px)");
  const [isOpen, { close }] = useDisclosure(true);

  return (
    <>
      <Box className={clsx(classes.root, className)}>
        <AppSidebar isOpen={isSideBarOpen} />
        <Box component="main" p="sm" className={classes.content}>
          {children}
        </Box>
        <RequireLoginModal />
      </Box>
      {unsupportedDisplay && (
        <AppModal title="お知らせ" opened={isOpen} onClose={close}>
          まだ対応していない端末のため、画面のレイアウトに問題が発生する可能性があります。
          PCやタブレットなどの幅の広い端末を使用してください。
        </AppModal>
      )}
    </>
  );
};
