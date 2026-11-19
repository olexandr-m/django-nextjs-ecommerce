import { baseApiSlice } from "@/lib/redux/base-api-slice";
import { getLastFetchCall, mockFetchResponse, setupApiStore } from "@tests/setup-api-store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const testApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    ping: builder.query<{ ok: boolean }, void>({
      query: () => ({
        url: "/ping/",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

function getFetchHeaders() {
  const [request, options] = getLastFetchCall();

  if (options?.headers) return options.headers;

  if (request instanceof Request) return request.headers;

  return new Headers();
}

describe("baseApiSlice", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (global as any).document;
  });

  it("uses test baseUrl when NODE_ENV=test", async () => {
    mockFetchResponse({ ok: true });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const [request] = getLastFetchCall();
    const url = typeof request === "string" ? request : request.url;

    expect(url).toBe("http://localhost:8080/api/ping/");
  });

  it("adds CSRF header when csrf_token cookie exists", async () => {
    (global as any).document = {
      cookie: "csrf_token=abc123; other=value",
    };

    mockFetchResponse({ ok: true });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const headers = getFetchHeaders();

    expect(headers.get("X-CSRF-TOKEN")).toBe("abc123");
  });

  it("does NOT add CSRF header when cookie is missing", async () => {
    (global as any).document = {
      cookie: "other=value",
    };

    mockFetchResponse({ ok: true });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const headers = getFetchHeaders();
    expect(headers.get("X-CSRF-TOKEN")).toBeNull();
  });

  it("adds default Accept-Language header when there is no locale in path", async () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/" },
      configurable: true,
    });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const headers = getFetchHeaders();
    expect(headers.get("Accept-Language")).toBe("en");
  });

  it("adds custom Accept-Language header when there is locale in path", async () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/uk/home" },
      configurable: true,
    });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const headers = getFetchHeaders();

    expect(headers.get("Accept-Language")).toBe("uk");
  });

  it("adds default Accept-Language header when locale in path do not supports", async () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/fr/home" },
      configurable: true,
    });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const headers = getFetchHeaders();

    expect(headers.get("Accept-Language")).toBe("en");
  });

  it("does not crash when document is undefined (SSR-safe)", async () => {
    delete (global as any).document;

    mockFetchResponse({ ok: true });

    const { store } = setupApiStore();

    await expect(store.dispatch(testApi.endpoints.ping.initiate())).resolves.not.toThrow();
  });

  it("sets credentials=include", async () => {
    (global as any).document = {
      cookie: "csrf_token=test",
    };

    mockFetchResponse({ ok: true });

    const { store } = setupApiStore();

    await store.dispatch(testApi.endpoints.ping.initiate());

    const [request, options] = getLastFetchCall();

    const credentials =
      options?.credentials ?? (request instanceof Request ? request.credentials : undefined);

    expect(credentials).toBe("include");
  });
});
