import { Burger, useMantineTheme } from "@mantine/core";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  width: string;
};

export const SideMenuToggle: React.FC<Props> = ({
  isOpen,
  onToggle,
  width,
}) => {
  const mantineTheme = useMantineTheme();

  return (
    <Burger
      opened={isOpen}
      onClick={onToggle}
      color={mantineTheme.colors.gray[1]}
      sx={(theme) => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        width,
        height: "auto",
        aspectRatio: "1",
        color: theme.colors.gray[1],

        borderRadius: "50%",
        transition: "all 250ms",
        backgroundColor: theme.colors.red[8],
        "&:hover": {
          backgroundColor: theme.colors.red[5],
        },
      })}
    />
  );
};
