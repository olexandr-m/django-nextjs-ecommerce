import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const push = vi.fn();
const replace = vi.fn();
const showToastMock = vi.fn();

type NestedMessages = { [key: string]: string | NestedMessages };
let currentMessages: NestedMessages = {};
export function setMessages(messages: NestedMessages) {
  currentMessages = messages;
}

const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || path;
};

const hasNestedValue = (obj: any, path: string): boolean => {
  const result = path.split(".").reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj);
  return result !== undefined;
};

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    }),
    useRouter: () => ({
      push,
      replace,
      prefetch: vi.fn(),
    }),
    useParams: () => ({ locale: "en" }),
    usePathname: () => "/en",
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock("@/lib/i18n/routing", async () => {
  const actual = await vi.importActual("@/lib/i18n/routing");
  return {
    ...actual,
    routing: { locales: ["en", "uk"], defaultLocale: "en" },
    useRouter: () => ({
      push,
      replace,
      prefetch: vi.fn(),
    }),
    usePathname: () => "/test-path",
    Link: actual.Link,
  };
});

vi.mock("next-intl/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl/server")>();

  return {
    ...actual,
    getTranslations: async () => {
      const t = ((key: string) => getNestedValue(currentMessages, key)) as any;

      t.has = (key: string) => hasNestedValue(currentMessages, key);

      return t;
    },
  };
});

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();

  return {
    ...actual,
    useTranslations: () => (key: string) => getNestedValue(currentMessages, key),
  };
});

vi.mock("next/image", () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const { src, alt, priority, ...rest } = props;
      return <img alt={alt} src={typeof src === "string" ? src : ""} {...rest} />;
    },
  };
});

vi.mock("@/components/shared/Toast", () => {
  return {
    useToast: () => ({ showToast: showToastMock }),
  };
});

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    className: "mock-inter-class",
  }),
}));

export { push, replace, showToastMock };
