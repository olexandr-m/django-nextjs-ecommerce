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
