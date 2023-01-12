import { IconType } from "react-icons";
import { SideMenuItem } from "./SideMenuItem";

type Props = { icon: IconType };

export const SideMenuLink: React.FC<Props> = ({ icon }) => {
  return <SideMenuItem icon={icon} href="" label="hello" />;
};
