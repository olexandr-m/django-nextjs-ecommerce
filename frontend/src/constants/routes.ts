export const AUTH_ROUTES = ["/register"];
export const PROTECTED_ROUTES = ["/account", "/admin"];

const normalizePath = (pathWithoutLocale: string) => {
  const normalized = pathWithoutLocale.replace(/\/$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const isAuthRoute = (pathWithoutLocale: string) => {
  const finalPath = normalizePath(pathWithoutLocale);
  return AUTH_ROUTES.some(
    (route) => finalPath === route || finalPath.startsWith(`${route}/`),
  );
};

export const isProtectedRoute = (pathWithoutLocale: string) => {
  const finalPath = normalizePath(pathWithoutLocale);
  return PROTECTED_ROUTES.some(
    (route) => finalPath === route || finalPath.startsWith(`${route}/`),
  );
};
