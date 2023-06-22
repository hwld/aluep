import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/router";

type UseHashRemoverOnClickOutsideArgs = {
  canRemove?: (hash: string) => boolean;
};

/** 渡された要素の外側をクリックすると、hashが削除される。
 */
export const useHashRemoverOnClickOutside = ({
  canRemove = () => true,
}: UseHashRemoverOnClickOutsideArgs) => {
  const router = useRouter();

  const ref = useClickOutside(async () => {
    if (canRemove(location.hash.slice(1))) {
      // hashを空にすると一番上までスクロールしてしまうので、空にするまえに位置を保持しておく
      // ページのレイアウト変えてスクロールする要素が変わったら動かなくなる。
      const scrollPos = document.documentElement.scrollTop;

      // next/routerはpushStateを使用するため、フラグメントを変更してもtarget疑似クラスが
      // 消されない。
      // そのため、location.hashを使用して直接変更する
      location.hash = "";
      window.scrollTo(0, scrollPos);

      // URLから残った"#"を消す
      router.replace(location.href.split("#")[0], undefined, {
        shallow: true,
        scroll: false,
      });
    }
  });

  return ref;
};
