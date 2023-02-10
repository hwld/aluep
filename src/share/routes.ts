// TODO

// 現在は色んな所で文字列としてurlを指定しているが、将来的にはオブジェクトにまとめる
export const Routes = {
  theme: (id: string) => `/themes/${id}`,
  developer: (themeId: string, developerId: string) =>
    `${Routes.theme(themeId)}/developers/${developerId}/detail`,
  user: (id: string) => `/users/${id}`,
};
