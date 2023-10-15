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
      classNames={{
        item: clsx(classes.root, { [classes.red]: red }),
        itemSection: classes.itemSection,
        itemLabel: classes.itemLabel,
      }}
    >
      {props.children}
    </Menu.Item>
  );
};
