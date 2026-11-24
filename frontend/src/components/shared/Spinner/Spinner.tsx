import clsx from "clsx";
import Image from "next/image";
import styles from "./spinner.module.css";

interface SpinnerProps {
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
}

const dimensionMap = {
  xxs: 12,
  xs: 24,
  sm: 40,
  md: 80,
  lg: 128,
  xl: 208,
};

export function Spinner({ size = "md", variant = "light" }: SpinnerProps) {
  const widthHeight = dimensionMap[size];
  const spinnerSrc = `/assets/images/shared/spinner-${variant}.svg`;

  return (
    <span className={styles.root} role="status">
      <Image
        className={clsx(styles.spinnerBase, styles[size])}
        height={widthHeight}
        width={widthHeight}
        alt="Loading..."
        data-testid="spinner"
        src={spinnerSrc}
      />
      <span className={styles.srOnly}>Loading...</span>
    </span>
  );
}
