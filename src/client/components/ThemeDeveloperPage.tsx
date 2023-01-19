import { Title } from "@mantine/core/lib/Title";
import { Theme } from "../../server/models/theme";
type Props = { theme: Theme };

export const ThemeDeveloperPage: React.FC<Props> = ({ theme: Theme }) => {
  return (
    <>
      <Title>参加しているお題</Title>
    </>
  );
};
