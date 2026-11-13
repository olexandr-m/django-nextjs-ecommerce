import { isAuthRoute, isProtectedRoute } from "@/constants";
import { routing } from "@/lib/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const locale = req.nextUrl.locale || routing.defaultLocale;
  const { pathname } = req.nextUrl;

  const pathnameWithoutLocale =
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
      ? pathname.slice(locale.length + 1) || "/"
      : pathname;

  const isPublicAuthRoute = isAuthRoute(pathnameWithoutLocale);
  const isLoggedIn = req.cookies.get("logged_in")?.value === "true";

  if (isLoggedIn && isPublicAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url, { status: 307 });
  }

  if (!isLoggedIn && isProtectedRoute(pathnameWithoutLocale)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url, { status: 307 });
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
