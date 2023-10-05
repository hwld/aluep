import { Routes } from "@/share/routes";
import { Anchor, Box, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import classes from "./SidebarAppTitle.module.css";

export const SidebarAppTitle: React.FC = () => {
  return (
    <Anchor component={Link} href={Routes.home} className={classes.root}>
      <Box bg="red.2" className={classes.contaienr}>
        <Image
          src="/logo.svg"
          alt="app-log"
          width={40}
          height={40}
          style={{ marginTop: "2px" }}
        />
      </Box>
      <Title c="gray.1" order={3} className={classes.title}>
        Aluep
      </Title>
    </Anchor>
  );
};
