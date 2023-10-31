import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { SvgLink } from "@tabler/icons-react";

type Props = { url: string };
export const DevItemIconLink: React.FC<Props> = ({ url }) => {
  return (
    <DevCardIconLink
      label="開発したものを見に行く"
      url={url}
      icon={
        <SvgLink width="80%" height="80%" color="var(--mantine-color-gray-7)" />
      }
    />
  );
};
