import {
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { forwardRef } from "react";
import classes from "./LoginButton.module.css";

type Props = Omit<{} & UnstyledButtonProps, "style" | "className">;

export const LoginButton = forwardRef<HTMLButtonElement, Props>(
  function LoginButton({ ...props }, ref) {
    const handleLogin = () => {
      signIn("github");
    };

    return (
      <UnstyledButton
        ref={ref}
        {...props}
        style={{ overflow: "hidden" }}
        className={classes.root}
        onClick={handleLogin}
      >
        <Group gap={9} wrap="nowrap">
          <IconLogin2
            color="var(--mantine-color-gray-1)"
            size={35}
            style={{ flexShrink: 0, marginInline: "7px" }}
          />
          <Text
            c="gray.1"
            fw="bold"
            fz="sm"
            style={{ minWidth: 0, flexShrink: 1, whiteSpace: "nowrap" }}
          >
            ログイン
          </Text>
        </Group>
      </UnstyledButton>
    );
  }
);
