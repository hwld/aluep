// TODO
// 現在は色んな所で文字列としてurlを指定しているが、将来的にはオブジェクトにまとめる
export const Routes = {
  themeDetail: (id: string) => `/themes/${id}`,
  userDetail: (id: string) => `/users/${id}`,
};
