import { Avatar, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = { developer: Session["user"] };

export const DeveloperDetailLinkButton: React.FC<Props> = ({ developer }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <>
      <a href="/developers/detail">
        <UnstyledButton>
          <Avatar src={developer.image} radius="xl" />
        </UnstyledButton>
      </a>
    </>
  );
};
