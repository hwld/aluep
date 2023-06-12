import { Menu as MantineMenu, MenuProps, Overlay } from "@mantine/core";
import { ReactNode, useState } from "react";

type Props = { children: ReactNode } & MenuProps;
// mantineのMenuと被るのでAppMenuにする
export const AppMenu: React.FC<Props> = ({ children, ...props }) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantineMenu
      transition="pop"
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      radius="md"
      styles={(theme) => ({
        item: {
          transition: "all 200ms",
        },
        dropdown: {
          minWidth: "200px",
          backgroundColor: theme.colors.gray[1],
          boxShadow: theme.shadows.md,
          padding: "8px 5px !important",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: theme.colors.gray[2],
        },
      })}
      {...props}
    >
      {/* メニューを開いているときは、メニュー外のアイテムをクリックできなくする */}
      {opened && <Overlay opacity={0} sx={{ position: "fixed" }} />}
      {children}
    </MantineMenu>
  );
};
