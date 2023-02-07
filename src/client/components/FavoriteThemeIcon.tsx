import { Flex, useMantineTheme } from "@mantine/core";
import { MdFavorite } from "react-icons/md";
import { TbFileText } from "react-icons/tb";

const styles = {
  sm: {
    favorite: { size: "25", margin: "0 0 0 0" },
    text: { size: "15", margin: "5 0 0 -8" },
  },
  md: {
    favorite: { size: "30", margin: "0 0 0 0" },
    text: { size: "20", margin: "10 0 0 -10" },
  },
} as const;

type Props = { size?: "sm" | "md" };
export const FavoriteThemeIcon: React.FC<Props> = ({ size = "md" }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Flex justify="center" align="center">
      <MdFavorite
        size={styles[size].favorite.size}
        color={mantineTheme.colors.red[7]}
        // MdFavoriteが上に重なるようにする
        style={{ margin: styles[size].favorite.margin, position: "relative" }}
      />
      <TbFileText
        size={styles[size].text.size}
        color={mantineTheme.colors.gray[7]}
        style={{ margin: styles[size].text.margin }}
      />
    </Flex>
  );
};
