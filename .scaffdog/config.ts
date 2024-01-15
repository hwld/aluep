import { Context } from "scaffdog";

export default {
  files: ["*"],
  helpers: [
    {
      // `/`で区切られた最後の文字列を取得する
      filename: (_: Context, value: string) => value.split("/").at(-1),

      // `/`で区切られた文字列の各部分をpascalケースに変換する
      pathPascal: (c: Context, value: string) => {
        const pascal = c.helpers.get("pascal");
        if (!pascal) {
          return value;
        }

        return value
          .split("/")
          .map((v) => pascal(c, v))
          .join("/");
      },
    },
  ],
};
