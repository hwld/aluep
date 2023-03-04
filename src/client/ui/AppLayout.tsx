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
  // TODO: スマートフォンなどの幅の狭い端末に対応していない
  const unsupportedDisplay = useMediaQuery("(max-width: 600px)");
  const [isOpen, { close }] = useDisclosure(true);

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[2],
          minHeight: "100dvh",
          display: "flex",
        })}
      >
        <AppSidebar loggedInUser={session?.user} />
        <Box
          component="main"
          p="xl"
          sx={(theme) => ({
            width: "100%",
            minWidth: "0",
            margin: "0 auto",
          })}
        >
          {children}
        </Box>
        <RequireLoginModal />
      </Box>
      {/* TODO: まだスマートフォンなどに対応していないため、初訪問時に知らせる。 */}
      {unsupportedDisplay && (
        <AppModal title="お知らせ" opened={isOpen} onClose={close}>
          まだ対応していない端末のため、画面のレイアウトに問題が発生する可能性があります。
          PCやタブレットなどの幅の広い端末を使用してください。
        </AppModal>
      )}
    </>
  );
};