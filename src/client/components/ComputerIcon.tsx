import { SVGProps } from "react";

type Props = Omit<SVGProps<SVGElement>, "ref"> & { size?: string };
export const ComputerIcon: React.FC<Props> = ({ size, ...props }) => {
  return (
    <svg
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      {...props}
    >
      <path d="m510.163 392.022-45.59-57.326V93.611c0-11.662-9.458-21.12-21.12-21.12H68.546c-11.662 0-21.115 9.458-21.115 21.12v241.085L1.837 392.022A8.446 8.446 0 0 0 0 397.287v25.373c0 9.311 7.542 16.849 16.849 16.849h478.302c9.307 0 16.849-7.538 16.849-16.849v-25.373c0-1.92-.644-3.77-1.837-5.265zM77.226 102.291h357.548v202.606H77.226V102.291zM304.121 419.47h-96.242v-25.478h96.242v25.478z" />
    </svg>
  );
};
