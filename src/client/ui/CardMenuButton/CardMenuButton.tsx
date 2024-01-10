import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { CardActionButton } from "@/client/ui/CardActionButton/CardActionButton";
import { Menu } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

type Props = {};

export const CardMenuButton: React.FC<Props> = () => {
  return (
    <AppMenu>
      <Menu.Target>
        <CardActionButton icon={<IconDots />} />
      </Menu.Target>
    </AppMenu>
  );
};
