import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("common");

  return (
    <div className="">
      <h1 className="">{t("home_page.greeting")}</h1>
    </div>
  );
}
