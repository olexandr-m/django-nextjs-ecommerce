"use client";

import { mainNavbarLinks } from "@/constants";
import { Link } from "@/lib/i18n/routing";
import { LayoutLinks } from "@/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function StickyNavbar() {
  const t = useTranslations("common.main_layout");
  const CATEGORIES: LayoutLinks[] = [
    { id: 1, path: "/cat-1", label: "Category1" },
    { id: 2, path: "/cat-2", label: "Category2" },
  ];
  const [showStickyNavbar, setShowStickyNavbar] = useState(false);

  const menuWithCategories = mainNavbarLinks.map((item) =>
    item.labelKey === "categories" ? { ...item, children: CATEGORIES } : item,
  );

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyNavbar((prev) => {
            const isOverThreshold = window.scrollY > 500;
            return prev !== isOverThreshold ? isOverThreshold : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={clsx("sticy-header", {
          "animated fadeInDown fixed": showStickyNavbar,
        })}
        data-testid="sticky-navbar"
      >
        <div className="position-relative d-lg-block d-none container">
          <div className="d-flex align-items-center justify-content-between">
            <Link href="/">
              <Image
                height={44}
                width={145}
                alt="Logo"
                priority
                src="/assets/images/main/logo.png"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
            <div className="mega-menu-default mega-menu d-lg-block d-none">
              <div className="container">
                <div className="row">
                  <nav>
                    <ul className="page-dropdown-menu d-flex align-items-center justify-content-center">
                      {menuWithCategories.map((item) => (
                        <li
                          className={clsx("dropdown-list", item.className)}
                          key={item.labelKey ?? item.label}
                        >
                          {item.children ? (
                            <>
                              <a>
                                <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                                <span className="menuarrow">
                                  <i className="flaticon-down-arrow"></i>
                                </span>
                              </a>
                              <ul className="dropdown">
                                {item.children.map((child) => (
                                  <li className="cursor-pointer" key={child.labelKey ?? child.label}>
                                    <Link href={child.path ?? "/"}>
                                      {child.labelKey ? t(child.labelKey) : child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link href={item.path ?? "/"}>
                              <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
