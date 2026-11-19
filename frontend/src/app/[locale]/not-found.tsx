import { ExceptionView } from "@/components/shared/ExceptionView";
import { createMetadata } from "@/utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return createMetadata({ namespace: "common.not_found", robots: { index: false, follow: false } });
}

export default async function NotFound() {
  const t = await getTranslations("common.not_found");

  return (
    <ExceptionView
      buttonLink="/"
      buttonText={t("go_home")}
      code="404"
      description={t("description")}
      title={t("title")}
    />
  );
}
