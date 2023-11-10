import fs from "fs";
import { pascalCase } from "change-case";

const features = fs.readdirSync("src/client/features");
const others = ["pageComponents", "ui"];

/** @param {import("plop").NodePlopAPI} plop */
export default function plop(plop) {
  // スラッシュ区切りで一番最後の文字列を取り除いた文字列を返す
  plop.setHelper("componentPaths", (text) => {
    const paths = text.split("/").map((t) => pascalCase(t));
    paths.pop();

    return `/${paths.join("/")}`;
  });

  // 入力された値からスラッシュ区切りで一番最後の文字列をコンポーネント名と解釈する
  plop.setHelper("componentName", (text) => {
    return pascalCase(text.split("/").at(-1));
  });

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

      // 例えばList/Item/Titleと入力すると、
      // componentPathsには List/Item
      // componentNameではTitleに変換される。
      const path =
        componentGeneratePath +
        "{{ componentPaths name}}" +
        "/{{ componentName name}}/{{componentName name}}";

      return [
        {
          type: "add",
          path: `${path}.tsx`,
          templateFile: ".plop/component.tsx.hbs",
        },
        {
          type: "add",
          path: `${path}.stories.tsx`,
          templateFile: ".plop/component.stories.tsx.hbs",
        },
      ];
    },
  });
}
