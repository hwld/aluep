import fs from "fs";

const features = fs.readdirSync("src/client/features");
const others = ["pageComponents", "ui"];

/** @param {import("plop").NodePlopAPI} plop */
export default function plop(plop) {
  plop.setGenerator("component", {
    description: "Generate a new React component",
    prompts: [
      {
        type: "list",
        name: "feature",
        message: "feature name please",
        choices: [...others, ...features],
      },
      {
        type: "input",
        name: "name",
        message: "component name please",
      },
    ],
    actions: (answers) => {
      const componentGeneratePath = features.includes(answers.feature)
        ? "src/client/features/{{feature}}"
        : "src/client/{{feature}}";
      return [
        {
          type: "add",
          path:
            componentGeneratePath +
            "/{{pascalCase name}}/{{pascalCase name}}.tsx",
          templateFile: ".plop/component.tsx.hbs",
        },
        {
          type: "add",
          path:
            componentGeneratePath +
            "/{{pascalCase name}}/{{pascalCase name}}.stories.tsx",
          templateFile: ".plop/component.stories.tsx.hbs",
        },
      ];
    },
  });
}
