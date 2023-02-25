import { Menu, MenuItemProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { createMenuItemStyleProps } from "./createMenuItemStyleProps";

type Props = { red?: boolean } & LinkProps & MenuItemProps;
export const MenuLinkItem: React.FC<Props> = ({ red, ...props }) => {
  const styleProps = createMenuItemStyleProps(red);
  return (
    <Menu.Item component={Link} {...styleProps} {...props}>
      {props.children}
    </Menu.Item>
  );
};
