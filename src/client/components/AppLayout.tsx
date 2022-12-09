import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { AppHeader } from "./AppHeader/AppHeader";

type Props = { children: ReactNode };

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();

  return (
    <>
      <AppShell
        padding="md"
        header={<AppHeader user={session?.user} />}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[2] })}
        styles={() => ({
          body: { maxWidth: 1500, margin: "auto" },
          main: { width: "100%" },
        })}
      >
        {children}
      </AppShell>
    </>
  );
};
