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
        backgroundColor: theme.colors.gray[2],
        minHeight: "100vh",
      })}
    >
      <AppHeader user={session?.user} />
      <Box
        component="main"
        pt="xl"
        pb="sm"
        px="sm"
        sx={(theme) => ({
          maxWidth: "1500px",
          width: "100%",
          margin: "0 auto",
        })}
      >
        {children}
      </Box>
    </Box>
  );
};
