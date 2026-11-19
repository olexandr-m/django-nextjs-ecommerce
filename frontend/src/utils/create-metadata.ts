import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface MetadataProps {
  namespace: string;
  titleKey?: string;
  descriptionKey?: string;
  robots?: Metadata["robots"];
}

export async function createMetadata({
  namespace,
  titleKey = "metadata_title",
  descriptionKey = "metadata_description",
  robots,
}: MetadataProps): Promise<Metadata> {
  const t = await getTranslations(namespace);

  return {
    title: t.has(titleKey) ? t(titleKey) : undefined,
    description: t.has(descriptionKey) ? t(descriptionKey) : undefined,
    robots: robots ?? {
      index: true,
      follow: true,
    },
  };
}
