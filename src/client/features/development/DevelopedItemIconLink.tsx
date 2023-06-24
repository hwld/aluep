import { DevelopmentCardIconLink } from "@/client/features/development/DevelopmentCardLinkIcon";
import { useMantineTheme } from "@mantine/core";
import { TbLink } from "react-icons/tb";

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
