"use client";

import { mainNavbarLinks } from "@/constants";
import { Link } from "@/lib/i18n/routing";
import { LayoutLinks } from "@/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function MainNavbar() {
  const t = useTranslations("common.main_layout");

  const CATEGORIES: LayoutLinks[] = [
    { id: 1, path: "/cat-1", label: "Category1" },
    { id: 2, path: "/cat-2", label: "Category2" },
  ];

  const menuWithCategories = mainNavbarLinks.map((item) =>
    item.labelKey === "categories" ? { ...item, children: CATEGORIES } : item,
  );

  return (
    <>
      <header className="header-style-3" style={{ borderBottom: "1px solid var(--border-gray)" }}>
        <div className="menubox">
          <div className="container-fluid">
            <div className="d-lg-block d-none">
              <div className="row g-0 position-relative">
                <div className="col-lg-3 d-flex align-items-center justify-content-center border-rit">
                  <div className="logo pt-4">
                    <Link href="/">
                      <Image
                        height={44}
                        width={145}
                        alt="Logo"
                        priority
                        src="/assets/images/main/logo.png"
                        style={{ width: "full", height: "auto" }}
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-9 g-0 p-0">
                  <div className="row g-0 holder">
                    <div className="col-12">
                      <div className="some-info">
                        <p className="d-flex align-items-center">
                          <span className="icon">
                            <i className="flaticon-power"></i>
                          </span>
                          {t("welcome")}
                        </p>
                        <div
                          className="right d-flex align-items-center items-center"
                          style={{ height: "26px" }}
                        >
                          <div className="d-flex align-items-center items-center">
                            <div>
                              <div>
                                <Link href="/register" role="button">
                                  {t("register")}
                                </Link>
                                /
                                <Link href="/login" role="button">
                                  {t("login")}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-one"></div>
                  <div className="row g-0 holder">
                    <div className="col-12">
                      <div className="mega-menu-default mega-menu d-lg-block d-none">
                        <div className="d-flex align-items-center justify-content-between">
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

                          <div className="right d-flex align-items-center justify-content-end">
                            <ul className="main-menu__widge-box d-flex align-items-center">
                              <li className="d-lg-block d-none">
                                <Link data-testid="user-icon" href="/account" role="button">
                                  <i className="flaticon-user"></i>
                                </Link>
                              </li>
                              <li className="d-lg-block d-none">
                                <Link className="number" data-testid="heart-icon" href="/" role="button">
                                  <i className="flaticon-heart"></i>
                                  <span className="count">(2)</span>
                                </Link>
                              </li>
                              <li className="cartm">
                                <Link
                                  className="number cart-icon"
                                  data-testid="cart-icon"
                                  href="/"
                                  role="button"
                                >
                                  <i className="flaticon-shopping-cart mr-1"></i>
                                  <span className="count">(0)</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
