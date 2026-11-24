import { LayoutLinks } from "@/types";

export const mainNavbarLinks: LayoutLinks[] = [
  { id: "home", path: "/", labelKey: "home" },
  { id: "shop", path: "/", labelKey: "shop" },
  {
    id: "categories",
    labelKey: "categories",
    className: "megamenu",
    children: [],
  },
  {
    id: "pages",
    labelKey: "pages",
    children: [
      { id: "about", path: "/", labelKey: "about" },
      { id: "faq", path: "/", labelKey: "faq" },
      { id: "order_track", path: "/", labelKey: "order_track" },
      { id: "my_account", path: "/", labelKey: "my_account" },
    ],
  },
  { id: "blog", path: "/", labelKey: "blog" },
  { id: "contacts", path: "/", labelKey: "contacts" },
];

export const mainFooterUsefulLinks: LayoutLinks[] = [
  { id: "account", path: "/", labelKey: "account" },
  { id: "sign_in", path: "/", labelKey: "sign_in" },
  { id: "cart", path: "/", labelKey: "cart" },
  { id: "wish_list", path: "/", labelKey: "wish_list" },
  { id: "compare_products", path: "/", labelKey: "compare_products" },
];

export const mainFooterInformationLinks: LayoutLinks[] = [
  { id: "about", path: "/", labelKey: "about" },
  { id: "contacts", path: "/", labelKey: "contacts" },
  { id: "faq", path: "/", labelKey: "faq" },
  { id: "products", path: "/", labelKey: "latest_products" },
  { id: "track", path: "/", labelKey: "order_track" },
];
