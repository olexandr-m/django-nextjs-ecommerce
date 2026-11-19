import { routing } from "@/lib/i18n/routing";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isTest = process.env.NODE_ENV === "test";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: isTest ? "http://localhost:8080/api" : "/api",

  prepareHeaders: (headers) => {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken && typeof csrfToken === "string") {
      headers.set("X-CSRF-TOKEN", csrfToken);
    }

    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/");
      const supportedLocales = routing.locales as readonly string[];

      const urlLocale = pathSegments.find((s) => supportedLocales.includes(s));
      const cookieLocale = getCookie("NEXT_LOCALE");

      const finalLocale = urlLocale ?? cookieLocale ?? routing.defaultLocale;

      headers.set("Accept-Language", finalLocale);
    }

    headers.set("Accept", "application/json");

    return headers;
  },

  credentials: "include",
});

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});
