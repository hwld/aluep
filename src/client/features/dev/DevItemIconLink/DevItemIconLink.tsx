import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { TbLink } from "react-icons/tb";

type Props = { url: string };
export const DevItemIconLink: React.FC<Props> = ({ url }) => {
  return (
    <DevCardIconLink
      label="開発したものを見に行く"
      url={url}
      icon={<TbLink size="80%" color="var(--mantine-color-gray-7)" />}
    />
  );
};
