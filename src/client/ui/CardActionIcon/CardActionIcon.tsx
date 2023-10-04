import { ActionIcon, ActionIconProps } from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";
import classes from "./CardActionIcon.module.css";

type Props = ActionIconProps & ComponentPropsWithoutRef<"button">;
export const CardActionIcon: React.FC<Props> = ({ children, ...props }) => {
  return (
    <ActionIcon {...props} className={classes.root}>
      {children}
    </ActionIcon>
  );
};
