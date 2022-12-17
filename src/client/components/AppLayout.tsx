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
        minHeight: "100vh",
      })}
    >
      <AppHeader user={session?.user} />
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
        }}
        pt={50}
      >
        <Box
          component="main"
          p="sm"
          sx={(theme) => ({
            maxWidth: "1500px",
            margin: "0 auto",
          })}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
