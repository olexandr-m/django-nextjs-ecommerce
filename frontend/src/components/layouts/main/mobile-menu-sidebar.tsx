"use client";

import { mainSidebarLinks } from "@/constants";
import { Link } from "@/lib/i18n/routing";
import { LayoutLinks } from "@/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function MobileMenuSidebar() {
  const uniqueId = React.useId();
  const t = useTranslations("common.main_layout");

  const [showMobileMenuSidebar, setShowMobileMenuSidebar] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const CATEGORIES: LayoutLinks[] = [
    { id: 1, path: "/cat-1", label: "Category1" },
    { id: 2, path: "/cat-2", label: "Category2" },
  ];

  const menuWithCategories = mainSidebarLinks.map((item) =>
    item.labelKey === "categories" ? { ...item, children: CATEGORIES } : item,
  );

  const toggleSection = (id: string | number) => {
    const stringId = String(id);
    setOpenSections((prev) => ({
      ...prev,
      [stringId]: !prev[stringId],
    }));
  };

  useEffect(() => {
    if (showMobileMenuSidebar) {
      document.body.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
    }

    return () => {
      document.body.classList.remove("lock-scroll");
    };
  }, [showMobileMenuSidebar]);

  return (
    <>
      <div className="row d-lg-none d-block" style={{ borderBottom: "1px solid var(--border-gray)" }}>
        <div className="mobile-menu">
          <div className="mobile-menu__menu-top border-bottom-0">
            <div className="container">
              <div className="row">
                <div className="menu-info d-flex align-items-center justify-content-between px-2">
                  <div className="shrink-0">
                    <div
                      className="menubar"
                      data-testid="toggle-menu"
                      onClick={() => setShowMobileMenuSidebar(true)}
                    >
                      <span></span> <span></span> <span></span>
                    </div>
                  </div>

                  <div className="grow d-flex justify-content-center px-2">
                    <Link href="/">
                      <Image
                        height={40}
                        width={120}
                        alt="Logo"
                        priority
                        src="/assets/images/main/logo.png"
                        style={{ width: "120px", height: "40px" }}
                      />
                    </Link>
                  </div>

                  <div className="cart-holder d-flex align-items-center justify-content-end gap-2 shrink-0">
                    <div className="locale-wrapper"></div>

                    <Link
                      className="cart cart-icon position-relative"
                      aria-label="cart icon"
                      href="/"
                      role="button"
                    >
                      <i className="flaticon-shopping-cart"></i>
                      <span className="count text-xs" style={{ fontSize: "10px" }}>
                        (0)
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="menu-closer"></div>
          <div
            className={clsx("mobile-menu__sidebar-menu", {
              "animated fadeInDown fixed": showMobileMenuSidebar,
            })}
            data-testid="mobile-menu"
          >
            <div className="menu-closer two">
              <span></span>
              <span
                className="cross cursor-pointer"
                data-testid="toggle-menu-closer"
                style={{ cursor: "pointer" }}
                onClick={() => setShowMobileMenuSidebar(false)}
              >
                <i className="flaticon-cross pt-2"></i>
              </span>
            </div>
            <div className="search-box-holder">
              <form action="#0">
                <div className="form-group search-box menu">
                  <input
                    id={`search-for-products-${uniqueId}`}
                    className="form-control"
                    placeholder={t("search_product")}
                    type="text"
                  />
                  <span className="search-icon">
                    <i className="flaticon-magnifying-glass"></i>
                  </span>
                </div>
              </form>
            </div>
            <ul className="page-dropdown-menu">
              {menuWithCategories.map((item) => (
                <li className="dropdown-list" key={item.id}>
                  {item.children ? (
                    <>
                      <a style={{ cursor: "pointer" }} onClick={() => toggleSection(item.id)}>
                        <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                        <span className="menuarrow">
                          <i className="flaticon-menu"></i>
                        </span>
                      </a>
                      <ul
                        className="dropdown pl-4"
                        style={{ display: openSections[item.id] ? "block" : "none" }}
                      >
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link href={child.path ?? "/"} onClick={() => setShowMobileMenuSidebar(false)}>
                              {child.labelKey ? t(child.labelKey) : child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={item.path ?? "/"} onClick={() => setShowMobileMenuSidebar(false)}>
                      <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
              <div>
                <li>
                  <Link href="/login" role="button">
                    {t("sign_in")}
                  </Link>
                </li>
                <li>
                  <Link href="/register" role="button">
                    {t("register")}
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
