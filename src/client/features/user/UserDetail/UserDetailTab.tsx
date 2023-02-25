import { Button } from "@mantine/core";
import { MouseEventHandler, PropsWithChildren } from "react";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  // TODO
  type: "post" | "join" | "like";
  activeType: "post" | "join" | "like";
} & PropsWithChildren;
export const UserDetailTab: React.FC<Props> = ({
  onClick,
  type,
  activeType,
  children,
}) => {
  const isActive = activeType === type;

  return (
    <Button
      variant="default"
      w={140}
      onClick={onClick}
      bg={isActive ? "red.7" : "gray.1"}
      color={isActive ? "gray.0" : "gray.7"}
      tabIndex={isActive ? -1 : 0}
      sx={(theme) => {
        return {
          pointerEvents: isActive ? "none" : "auto",
          backgroundColor: isActive
            ? theme.colors.red[7]
            : theme.colors.gray[1],
          color: isActive ? theme.colors.gray[0] : theme.colors.gray[7],
          borderColor: isActive ? theme.colors.red[7] : theme.colors.gray[3],
          transition: "background-color 150ms",
          "&:hover": {
            color: isActive ? "auto" : theme.colors.gray[9],
            backgroundColor: isActive ? "auto" : theme.colors.gray[3],
          },
        };
      }}
    >
      {children}
    </Button>
  );
};
