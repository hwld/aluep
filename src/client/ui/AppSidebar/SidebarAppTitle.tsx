import { Anchor, Box, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "../../../share/routes";

export const SidebarAppTitle: React.FC = () => {
  return (
    <Anchor
      component={Link}
      href={Routes.home}
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 1,
        gap: "12px",
        overflow: "hidden",
        "&:hover": { textDecoration: "none" },
      }}
    >
      <Box
        bg="red.2"
        sx={(theme) => ({
          borderRadius: theme.radius.md,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          width: "45px",
          height: "45px",
          marginTop: "5px",
        })}
      >
        <Image
          src="/logo.svg"
          alt="app-log"
          width={40}
          height={40}
          style={{ marginTop: "2px" }}
        />
      </Box>
      <Title
        order={3}
        sx={(theme) => ({
          flexShrink: 0,
          color: theme.colors.gray[1],
        })}
      >
        Aluep
      </Title>
    </Anchor>
  );
};
