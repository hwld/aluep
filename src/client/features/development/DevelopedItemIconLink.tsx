import { useMantineTheme } from "@mantine/core";
import { TbLink } from "react-icons/tb";
import { DevelopmentCardIconLink } from "./DevelopmentCardLinkIcon";

type Props = { url: string };
export const DevelopedItemIconLink: React.FC<Props> = ({ url }) => {
  const { colors } = useMantineTheme();

  return (
    <DevelopmentCardIconLink
      label="開発したものを見に行く"
      url={url}
      icon={<TbLink size="80%" color={colors.gray[7]} />}
    />
  );
};
