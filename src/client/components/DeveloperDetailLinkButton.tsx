import { Avatar, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import { createContext } from "react";

type Props = { developer: Session["user"] };
export const developerontext = createContext("");
export const DeveloperDetailLinkButton: React.FC<Props> = ({ developer }) => {
  return (
    <>
      <a href="/developers/[developerid]/">
        <UnstyledButton>
          <Avatar src={developer.image} radius="xl" />
        </UnstyledButton>
      </a>
    </>
  );
};
