import { Flex, useMantineTheme } from "@mantine/core";
import { MdComputer, MdFavorite } from "react-icons/md";

const styles = {
  sm: {
    favorite: { size: "25", margin: "0 0 0 0" },
    computer: { size: "15", margin: "5 0 0 -8" },
  },
  md: {
    favorite: { size: "30", margin: "0 0 0 0" },
    computer: { size: "20", margin: "10 0 0 -10" },
  },
} as const;

type Props = { size?: "sm" | "md" };
export const FavoriteDeveloperIcon: React.FC<Props> = ({ size = "md" }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Flex justify="center" align="center">
      <MdFavorite
        size={styles[size].favorite.size}
        color={mantineTheme.colors.red[7]}
        // MdFavoriteが上に重なるようにする
        style={{ margin: styles[size].favorite.margin, position: "relative" }}
      />
      <MdComputer
        size={styles[size].computer.size}
        style={{ margin: styles[size].computer.margin }}
        color={mantineTheme.colors.gray[7]}
      />
    </Flex>
  );
};
