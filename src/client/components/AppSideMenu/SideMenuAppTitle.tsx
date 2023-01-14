import { Anchor, Box, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export const SideMenuAppTitle: React.FC = () => {
  return (
    <Anchor
      component={Link}
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 1,
        gap: "10px",
        overflow: "hidden",
        "&:hover": { textDecoration: "none" },
      }}
    >
      <Box
        bg="red.3"
        sx={(theme) => ({
          borderRadius: theme.radius.md,
          marginTop: "5px",
          padding: "3px",
        })}
      >
        <Image src="/logo.svg" alt="app-log" width={35} height={35} />
      </Box>
      <Title
        order={3}
        sx={(theme) => ({
          flexShrink: 0,
          color: theme.colors.gray[1],
        })}
      >
        AppThemePost
      </Title>
    </Anchor>
  );
};
