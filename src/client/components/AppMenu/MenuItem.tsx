import { Menu, MenuItemProps } from "@mantine/core";
import { createMenuItemStyleProps } from "./createMenuItemStyleProps";

type Props = { red?: boolean } & MenuItemProps &
  React.ComponentPropsWithoutRef<"button">;
export const MenuItem: React.FC<Props> = ({ red, onClick, ...props }) => {
  const styleProps = createMenuItemStyleProps(red);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Menu.Item {...styleProps} {...props} onClick={handleClick}>
      {props.children}
    </Menu.Item>
  );
};
