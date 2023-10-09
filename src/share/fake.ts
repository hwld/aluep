import { faker } from "@faker-js/faker";

export const fakeString = (length?: number): string => {
  return faker.string.fromCharacters(characters, length);
};

const hiragana =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
const alphabets = "abcdefghijklmnopqrstuvwxyz";
const characters = [
  ...hiragana.split(""),
  ...alphabets.split(""),
  ...alphabets.split("").map((a) => a.toUpperCase()),
];
