import Providers from "@/components/providers";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const instant = false;

export const metadata = {
  title: "E-commerce",
  icons: {
    icon: {
      url: "/assets/images/main/favicon-32x32.png",
      type: "image/png",
      sizes: "32x32",
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      className={`${inter.variable} ${inter.className}`}
      data-scroll-behavior="smooth"
      lang={locale}
      suppressHydrationWarning
    >
      {/* eslint-disable @next/next/no-css-tags */}
      <head>
        <link href="/assets/css/bootstrap.5.1.1.min.css" rel="stylesheet" />
        <link href="/assets/fonts/flaticon.css" rel="stylesheet" />
        <link href="/assets/css/plugin/slick.css" rel="stylesheet" />
        <link href="/assets/css/plugin/jquery-ui.min.css" rel="stylesheet" />
        <link href="/assets/css/plugin/magnific-popup.css" rel="stylesheet" />
        <link href="/assets/css/plugin/nice-select.v1.0.css" rel="stylesheet" />
        <link href="/assets/css/plugin/animate.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" />
      </head>
      {/* eslint-enable @next/next/no-css-tags */}

      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
