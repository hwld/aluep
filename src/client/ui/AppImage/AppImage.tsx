import Image, { ImageProps } from "next/image";
import { SyntheticEvent, useEffect, useState } from "react";

type Props = ImageProps & { fallbackSrc?: string };

export const AppImage: React.FC<Props> = ({
  src,
  onError,
  style,
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState<boolean>(false);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    onError?.(e);
    setError(true);
  };

  // SSRを使用していると、imgのonErrorが補足されない (https://github.com/facebook/react/issues/15446)
  // そのため、クライアント側でsrcを再設定してエラーがあればエラーを発生させる
  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...props}
      onError={handleError}
      src={error ? fallbackSrc ?? "/alert.svg" : src}
      style={{
        objectFit: "contain",
        ...style,
      }}
    />
  );
};
