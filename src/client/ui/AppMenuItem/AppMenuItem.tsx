import { Menu, MenuItemProps } from "@mantine/core";
import clsx from "clsx";
import classes from "./AppMenuItem.module.css";

type Props = { red?: boolean } & MenuItemProps &
  React.ComponentPropsWithoutRef<"button">;
export const AppMenuItem: React.FC<Props> = ({ red, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Menu.Item
      {...props}
      onClick={handleClick}
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
