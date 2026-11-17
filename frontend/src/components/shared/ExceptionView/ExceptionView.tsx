import { Link } from "@/lib/i18n/routing";
import styles from "./ExceptionView.module.css";

interface ExceptionViewProps {
  code: string | number;
  title: string;
  description: string;
  buttonLink: string;
  buttonText: string;
}

export function ExceptionView({ code, title, description, buttonLink, buttonText }: ExceptionViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>{code}</h1>
        <div className={styles.messageBody}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <Link className={styles.homeLink} href={buttonLink} role="button">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
