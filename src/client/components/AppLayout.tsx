import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { AppHeader } from "./AppHeader/AppHeader";

type Props = { children: ReactNode };

export const AppLayout: React.FC<Props> = ({ children }) => {
  // TODO react-queryをつかってsession情報を取得する。
  const { session } = useSessionQuery();

  return (
    <>
      <AppShell
        padding="md"
        header={<AppHeader user={session?.user} />}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[2] })}
      >
        {children}
      </AppShell>
    </>
  );
};
