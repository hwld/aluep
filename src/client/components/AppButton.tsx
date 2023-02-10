import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react";

// TODO:
// MantineのButtonコンポーネントはcomponent propsによって任意のコンポーネント
// としてレンダリングできるが、それをカスタムコンポーネントの外から指定しようとすると型エラーが起こってしまう。
// その複雑性を隠蔽してnext/linkかボタンとしてレンダリングするボタンを作る
// 後で原因を調査したい。
// childrenが存在するときにhrefだけ渡してもエラーにならない...
type AppButtonProps = ButtonProps &
  ComponentPropsWithoutRef<"button"> &
  ({ asLink?: false } | { asLink: true; href: string; blank?: boolean });

export const AppButton: React.FC<AppButtonProps> = forwardRef<
  HTMLButtonElement,
  AppButtonProps
>(({ children, ...props }, ref) => {
  // asLink,href, blankがあるときに無条件で渡さないようにする
  // どうやって型エラーを無くすのがわからないので一時的に...
  // @ts-ignore
  const { asLink, href, blank, ...otherProps } = props;

  // なぜか型が間違っていると言われてしまうので無理やり型を合わせる
  const polymorphicProps = useMemo(() => {
    if (props.asLink) {
      return {
        component: Link,
        href: props.href,
        target: props.blank ? "_brank" : "_self",
      } as ButtonProps;
    }
    return { component: "button" } as ButtonProps;
  }, [props]);

  return (
    <Button ref={ref} {...polymorphicProps} {...otherProps}>
      {children}
    </Button>
  );
});

AppButton.displayName = "AppButton";
