import { createMenuItemStyleProps } from "@/client/ui/AppMenu/createMenuItemStyleProps";
import { MenuItemProps, Menu } from "@mantine/core";

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
