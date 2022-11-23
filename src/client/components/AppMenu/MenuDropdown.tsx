import { Menu, MenuDropdownProps } from "@mantine/core";
import React from "react";

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  children,
  ...props
}) => {
  const { onClick, ...others } = props;

  const handleClick: MenuDropdownProps["onClick"] = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Menu.Dropdown onClick={handleClick} {...props}>
      {children}
    </Menu.Dropdown>
  );
};
