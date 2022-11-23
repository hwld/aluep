import { Menu as MantineMenu, MenuProps, Overlay } from "@mantine/core";
import { ReactNode, useState } from "react";

type Props = { children: ReactNode } & MenuProps;
// mantineのMenuと被るのでAppMenuにする
export const AppMenu: React.FC<Props> = ({ children, ...props }) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantineMenu
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      styles={(theme) => ({
        item: { transition: "all 200ms" },
        dropdown: {
          backgroundColor: theme.colors.gray[1],
          boxShadow: theme.shadows.md,
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
