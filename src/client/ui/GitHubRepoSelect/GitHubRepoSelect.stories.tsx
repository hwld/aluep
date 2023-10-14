import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GitHubRepoSelect } from "./GitHubRepoSelect";

const meta = {
  component: GitHubRepoSelect,
} satisfies Meta<typeof GitHubRepoSelect>;
export default meta;

type Story = StoryObj<typeof meta>;

const createRepo = () => ({
  name: faker.person.firstName(),
  url: faker.internet.url(),
});

export const Default: Story = {
  args: { repositories: [], value: "" },
  render: function Render() {
    const [url, setUrl] = useState("");
    const [repositories, setRepositories] = useState(
      [...new Array(10)].map((_) => createRepo())
    );

    return (
      <GitHubRepoSelect
        value={url}
        repositories={repositories}
        onChange={(v) => setUrl(v)}
        onUpdateList={() => {
          setRepositories(() => [
            ...repositories,
            ...[...new Array(10)].map((_) => createRepo()),
          ]);
        }}
      />
    );
  },
};
