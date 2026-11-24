import { AuthFormHeader } from "@/features/auth/components/auth-form-header";
import { RegisterForm } from "@/features/auth/components/forms";
import { cn } from "@/lib/utils/cn";
import { createMetadata } from "@/utils";
import { getTranslations } from "next-intl/server";
import styles from "../auth-page.module.css";

export async function generateMetadata() {
  return createMetadata({ namespace: "auth.register", robots: { follow: false, index: false } });
}

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <>
      <div className={cn("w-full overflow-hidden", styles.pageWrapper)}>
        <div className={cn("register-page", styles.section)}>
          <div className={cn("container", styles.container)}>
            <div className={styles.flexCenter}>
              <AuthFormHeader
                linkHref="/login"
                linkText={t("log_in")}
                staticText={t("have_an_account")}
                title={t("title")}
              >
                <RegisterForm />
              </AuthFormHeader>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
