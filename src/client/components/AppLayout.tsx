import { AppShell, Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";
import { AppHeader } from "./AppHeader";

type Props = { children: ReactNode };

export const AppLayout: React.FC<Props> = ({ children }) => {
  // TODO react-queryをつかってsession情報を取得する。
  const { session } = useSessionQuery();

  return (
    <AppShell padding="md" header={<AppHeader user={session?.user} />}>
      {children}
    </AppShell>
  );
};
