import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import classes from "./CardActionButton.module.css";

type BaseProps = { label?: string; icon: ReactNode } & Omit<
  ActionIconProps,
  "size"
>;

export const CardActionButton = forwardRef<
  HTMLButtonElement,
  BaseProps & ComponentPropsWithoutRef<"button">
>(function CardActionButton({ label, icon, ...props }, ref) {
  const content = (
    <ActionIcon ref={ref} {...props} size={25} className={classes.action}>
      {icon}
    </ActionIcon>
  );

  if (label !== undefined) {
    return (
      <Tooltip
        label={label}
        position="top"
        withArrow
        transitionProps={{ transition: "pop" }}
        onClick={stopPropagation}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
});

export const CardActionLinkButton: React.FC<
  BaseProps & { url: string } & ComponentPropsWithoutRef<"a">
> = ({ label, icon, url, ...props }) => {
  const content = (
    <ActionIcon
      {...props}
      component={Link}
      href={url}
      target="_blank"
      size={25}
      className={classes.action}
    >
      {icon}
    </ActionIcon>
  );

  if (label !== undefined) {
    return (
      <Tooltip
        label={label}
        position="top"
        withArrow
        transitionProps={{ transition: "pop" }}
        onClick={stopPropagation}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
};
