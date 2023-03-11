import { Box } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ReactNode } from "react";
import { RequireLoginModal } from "../features/session/RequireLoginModal";
import { useSessionQuery } from "../features/session/useSessionQuery";
import { AppModal } from "./AppModal";
import { AppSidebar } from "./AppSidebar/AppSidebar";

type Props = { children: ReactNode };

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();
  const unsupportedDisplay = useMediaQuery("(max-width: 600px)");
  const [isOpen, { close }] = useDisclosure(true);

  return (
    <>
      <Box
        sx={(theme) => ({
          minHeight: "100dvh",
          display: "flex",
        })}
      >
        <AppSidebar loggedInUser={session?.user} />
        <Box
          component="main"
          p="xl"
          sx={{
            width: "100%",
            minWidth: "0",
            margin: "0 auto",
          }}
        >
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
