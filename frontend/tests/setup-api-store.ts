import { baseApiSlice } from "@/lib/redux/base-api-slice";
import { configureStore } from "@reduxjs/toolkit";
import { Mock, vi } from "vitest";

/* ------------------------------------------------------------------ */
/* fetch mock helpers                                                   */
/* ------------------------------------------------------------------ */

export function mockFetchResponse<T>(data: T, status = 200) {
  const mock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: {
      get: (name: string) => (name.toLowerCase() === "content-type" ? "application/json" : null),
    },
    clone() {
      return this;
    },
  } as unknown as Response);

  global.fetch = mock as unknown as typeof fetch;
  return mock;
}

/* ------------------------------------------------------------------ */
/* store setup                                                          */
/* ------------------------------------------------------------------ */

export function setupApiStore() {
  const store = configureStore({
    reducer: {
      [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApiSlice.middleware),
  });

  return { store };
}

/* ------------------------------------------------------------------ */
/* fetch inspection helpers                                             */
/* ------------------------------------------------------------------ */

function getFetchMock() {
  const fetchMock = global.fetch as unknown as Mock;
  if (!fetchMock?.mock?.calls?.length) {
    throw new Error("fetch was not called");
  }
  return fetchMock;
}

export function getLastFetchCall() {
  const fetchMock = getFetchMock();
  return fetchMock.mock.calls.at(-1)!;
}

export function getFetchUrl() {
  const [request] = getLastFetchCall();
  const url = typeof request === "string" ? request : request.url;
  return new URL(url).pathname;
}

export function getFetchMethod() {
  const [request, options] = getLastFetchCall();

  if (options?.method) return options.method;
  if (request instanceof Request) return request.method;

  return "GET";
}

export async function getFetchBody<T = unknown>() {
  const [request, options] = getLastFetchCall();

  if (options?.body) {
    return JSON.parse(options.body) as T;
  }

  if (request instanceof Request) {
    const text = await request.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }
}
