import { Menu as MantineMenu, MenuProps, Overlay } from "@mantine/core";
import { ReactNode, useState } from "react";
import classes from "./AppMenu.module.css";

type Props = { children: ReactNode } & MenuProps;
// mantineのMenuと被るのでAppMenuにする
export const AppMenu: React.FC<Props> = ({ children, ...props }) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantineMenu
      transitionProps={{ transition: "pop" }}
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      radius="md"
      classNames={{ item: classes.item, dropdown: classes.dropdown }}
      {...props}
    >
      {/* メニューを開いているときは、メニュー外のアイテムをクリックできなくする */}
      {opened && <Overlay opacity={0} className={classes.overlay} />}
      {children}
    </MantineMenu>
  );
};
