import { Link } from "@/lib/i18n/routing";
// import styles from "./ExceptionView.module.css";

interface ExceptionViewProps {
  code: string | number;
  title: string;
  description: string;
  buttonLink: string;
  buttonText: string;
}

export function ExceptionView({ code, title, description, buttonLink, buttonText }: ExceptionViewProps) {
  return (
    <div className="exception-container">
      <div className="exception-content">
        <h1 className="exception-code">{code}</h1>
        <div className="exception-message-body">
          <h2 className="exception-title ">{title}</h2>
          <p className="exception-description">{description}</p>
          <Link className="exception-home-link" href={buttonLink} role="button">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
