import { Box } from "@mantine/core";
import { ReactNode } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { AppHeader } from "./AppHeader/AppHeader";

type Props = { children: ReactNode };

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();

  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateRows: "auto 1fr",
        backgroundColor: theme.colors.gray[2],
        height: "100%",
        overflow: "hidden",
      })}
    >
      <AppHeader user={session?.user} />
      <Box
        sx={{
          overflow: "auto",
          scrollbarGutter: "stable both-edges",
          minHeight: "100%",
          width: "100%",
        }}
        pt="lg"
      >
        <Box
          component="main"
          p="sm"
          sx={(theme) => ({ maxWidth: "1500px", margin: "0 auto" })}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
