import { Menu, MenuItemProps } from "@mantine/core";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import classes from "../AppMenuItem/AppMenuItem.module.css";

type Props = { red?: boolean } & LinkProps & MenuItemProps;
export const AppMenuLinkItem: React.FC<Props> = ({ red, ...props }) => {
  return (
    <Menu.Item
      component={Link}
      {...props}
      className={clsx(classes.root, { [classes.red]: red })}
    >
      {props.children}
    </Menu.Item>
  );
};
