"use client";

import { Spinner } from "@/components/shared/spinner";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import styles from "./locale-dropdown.module.css";
import { routing, usePathname, useRouter } from "@/lib/i18n/routing";

type LocaleCode = (typeof routing.locales)[number];

const LOCALE_DATA: Record<LocaleCode, { label: string; flag: string }> = {
  en: { label: "EN", flag: "🇺🇸" },
  uk: { label: "UK", flag: "🇺🇦" },
};

export default function LocaleDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as LocaleCode;

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    routing.locales.forEach((loc) => {
      if (loc !== currentLocale) router.prefetch(pathname, { locale: loc });
    });
  }, [pathname, currentLocale, router]);

  const handleLocaleChange = (locale: LocaleCode) => {
    if (locale === currentLocale) return setOpen(false);

    startTransition(() => {
      router.replace(pathname, { locale });
      setOpen(false);
    });
  };

  useEffect(() => {
    const handler = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") setOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={isPending}
        onClick={() => setOpen(!open)}
      >
        {/* <span>{LOCALE_DATA[currentLocale].flag}</span> */}
        <span>{isPending ? <Spinner size="xxs" variant="dark" /> : LOCALE_DATA[currentLocale].label}</span>
        <ChevronDownIcon className={clsx(styles.chevron, open && styles.chevronOpen)} />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {routing.locales.map((locale) => (
            <li
              className={clsx(styles.option, locale === currentLocale && styles.active)}
              aria-selected={locale === currentLocale}
              key={locale}
              role="option"
              tabIndex={0}
              onClick={() => handleLocaleChange(locale)}
              onKeyDown={(e) => e.key === "Enter" && handleLocaleChange(locale)}
            >
              {/* <span>{LOCALE_DATA[locale].flag}</span> */}
              {LOCALE_DATA[locale].label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
