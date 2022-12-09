import { Avatar, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";

type Props = { theme: Theme; developer: ThemeDeveloper };
export const DeveloperDetailLinkButton: React.FC<Props> = ({
  theme,
  developer,
}) => {
  const router = useRouter();

  const handleGoDetail = () => {
    router.push(`/themes/${theme.id}/developers/${developer.id}/detail`);
  };
  return (
    <>
      <UnstyledButton onClick={handleGoDetail}>
        <Avatar src={developer.image} radius="xl" />
      </UnstyledButton>
    </>
  );
};
