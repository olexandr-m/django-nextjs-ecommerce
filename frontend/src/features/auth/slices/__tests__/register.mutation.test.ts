import { authApiSlice } from "../auth-api-slice";
import { registerCredentials } from "../../testing/auth.factory";
import {
  getFetchBody,
  getFetchMethod,
  getFetchUrl,
  mockFetchResponse,
  setupApiStore,
} from "@tests/setup-api-store";

const { store } = setupApiStore();
const credentials = registerCredentials();

describe("authApiSlice > register", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch with correct URL, method and body", async () => {
    mockFetchResponse({ token: "mock-token" });
    await store.dispatch(authApiSlice.endpoints.register.initiate(credentials));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(getFetchUrl()).toBe("/api/auth/register/");
    expect(getFetchMethod()).toBe("POST");
    expect(await getFetchBody()).toEqual(credentials);
  });

  it("returns success response", async () => {
    const response = {
      status: 201,
      message: "Registration successful",
      data: {
        username: "john_doe",
        email: "john@example.com",
      },
    };
    mockFetchResponse(response, 201);

    const result = await store.dispatch(authApiSlice.endpoints.register.initiate(credentials)).unwrap();

    expect(result).toEqual(response);
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  it("returns validation errors", async () => {
    const response = {
      status: 400,
      message: "Validation failed",
      errors: {
        email: ["Email already exists"],
        username: ["Username already exists"],
      },
    };

    mockFetchResponse(response, 400);

    await expect(
      store.dispatch(authApiSlice.endpoints.register.initiate(credentials)).unwrap(),
    ).rejects.toMatchObject({
      data: response,
    });
  });

  it("handles network errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(
      store.dispatch(authApiSlice.endpoints.register.initiate(credentials)).unwrap(),
    ).rejects.toMatchObject({
      status: "FETCH_ERROR",
    });
  });

  it("does not cache mutation results", async () => {
    mockFetchResponse({}, 201);

    await store.dispatch(authApiSlice.endpoints.register.initiate(credentials));

    await store.dispatch(authApiSlice.endpoints.register.initiate(credentials));

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
