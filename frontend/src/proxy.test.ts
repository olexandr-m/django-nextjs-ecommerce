import proxy from "@/proxy";
import { NextRequest, NextResponse } from "next/server";

vi.mock("next-intl/middleware", () => {
  return {
    default: vi.fn(() => vi.fn(() => "intl-response")),
  };
});

vi.mock("@/constants", () => ({
  isAuthRoute: vi.fn((path: string) => {
    return path === "/login" || path.startsWith("/activate/uid/token");
  }),
  isProtectedRoute: vi.fn((path: string) => {
    return path === "/login" || path.startsWith("/account");
  }),
}));

describe("Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (path: string, cookies: Record<string, string> = {}) => {
    const url = new URL(`https://example.com${path}`);
    const req = new NextRequest(url, {
      nextConfig: {
        i18n: {
          locales: ["en", "uk"],
          defaultLocale: "en",
        },
      },
    });

    Object.entries(cookies).forEach(([k, v]) => {
      req.cookies.set(k, v);
    });

    return req;
  };

  it("redirects to home if user is logged in and accessing auth routes", () => {
    const req = createRequest("/login", { logged_in: "true" });
    const res = proxy(req) as NextResponse;

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en");
  });

  it("redirects to home if user is logged in and accessing auth routes with route parameters", () => {
    const req = createRequest("/activate/uid/token", { logged_in: "true" });
    const res = proxy(req) as NextResponse;

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en");
  });

  it("redirects to login if user is not logged in and accessing protected routes", () => {
    const req = createRequest("/account", { logged_in: "false" });
    const res = proxy(req) as NextResponse;

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en/login");
  });

  it("delegates to intlMiddleware if user is not logged in", () => {
    const req = createRequest("/register", { logged_in: "false" });
    const res = proxy(req);

    expect(res).toBe("intl-response");
  });

  it("delegates to intlMiddleware for public routes", () => {
    const req = createRequest("/dashboard", { logged_in: "true" });
    const res = proxy(req);

    expect(res).toBe("intl-response");
  });

  it("handles routes that already have a locale prefix", () => {
    const req = createRequest("/uk/login", { logged_in: "true" });
    (req.nextUrl as any).locale = "uk";

    const res = proxy(req) as NextResponse;
    expect(res.headers.get("location")).toContain("/uk");
  });
});
