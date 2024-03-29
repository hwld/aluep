// Distributive Conditional Typesを使用してUnionのときにも使えるようにする。
export type OmitStrict<T, K extends keyof T> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never;
