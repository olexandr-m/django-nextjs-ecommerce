import { useRegister } from "../use-register";
import { TRegisterSchema } from "../../schemas";
import { act, renderHook } from "@testing-library/react";
import { registerCredentials } from "../../testing/auth.factory";
import { push, showToastMock } from "@tests/test-utils";

let mockIsLoading = false;
const credentials = registerCredentials();
const mockRegister = vi.fn();
const resetSpy = vi.fn();
const setErrorSpy = vi.fn();

vi.mock("../../slices/auth-api-slice", () => ({
  useRegisterMutation: () => [mockRegister, { isLoading: mockIsLoading }],
}));

const setup = () => {
  const { result: hook } = renderHook(() => useRegister());

  const performRegister = async (values: TRegisterSchema) => {
    await act(async () => {
      await hook.current.handleRegister(values, setErrorSpy, resetSpy);
    });

    return values;
  };

  return { performRegister };
};

describe("useRegister hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the loading state and register handler", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current).toEqual({
      handleRegister: expect.any(Function),
      isLoading: false,
    });
  });

  it("reflects the loading state from the mutation", () => {
    mockIsLoading = true;

    const { result } = renderHook(() => useRegister());
    expect(result.current.isLoading).toBe(true);
  });

  describe("handleRegister", () => {
    it("should call register mutation", async () => {
      mockRegister.mockReturnValue({ unwrap: () => Promise.resolve() });
      const { performRegister } = setup();
      await performRegister(credentials);

      expect(mockRegister).toHaveBeenCalledWith(credentials);
    });

    describe("API request successful", () => {
      it("shows success toast", async () => {
        mockRegister.mockReturnValue({ unwrap: () => Promise.resolve() });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(showToastMock).toHaveBeenCalledWith("activation_sent", "success");
      });

      it("redirects to login page", async () => {
        mockRegister.mockReturnValue({ unwrap: () => Promise.resolve() });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(push).toHaveBeenCalledWith("/login");
      });

      it("should reset the form values", async () => {
        mockRegister.mockReturnValue({ unwrap: () => Promise.resolve() });

        const { performRegister } = setup();
        await performRegister(credentials);

        expect(resetSpy).toHaveBeenCalled();
      });
    });

    describe("API request fail", () => {
      it("does NOT redirect or reset on failure", async () => {
        mockRegister.mockReturnValue({ unwrap: () => Promise.reject() });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(push).not.toHaveBeenCalled();
        expect(resetSpy).not.toHaveBeenCalled();
      });

      it("should map server errors to form fields", async () => {
        const mockError = { data: { errors: { email: ["taken"] } } };
        mockRegister.mockReturnValue({ unwrap: () => Promise.reject(mockError) });

        const { performRegister } = setup();

        await performRegister(credentials);

        expect(setErrorSpy).toHaveBeenCalledWith("email", { message: "taken", type: "server" });
      });

      it("maps multiple server errors to respective fields", async () => {
        const mockError = { data: { errors: { email: ["taken"], username: ["short"] } } };
        mockRegister.mockReturnValue({ unwrap: () => Promise.reject(mockError) });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(setErrorSpy).toHaveBeenCalledWith("email", { message: "taken", type: "server" });
        expect(setErrorSpy).toHaveBeenCalledWith("username", { message: "short", type: "server" });
      });

      it("shows error toast with message from backend", async () => {
        mockRegister.mockReturnValueOnce({
          unwrap: () => Promise.reject({ data: { message: "Error from API" } }),
        });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(showToastMock).toHaveBeenCalledWith("Error from API", "error");
      });

      it("shows error toast with default error message", async () => {
        mockRegister.mockReturnValueOnce({
          unwrap: () => Promise.reject(),
        });
        const { performRegister } = setup();

        await performRegister(credentials);

        expect(showToastMock).toHaveBeenCalledWith("An unexpected error occurred", "error");
      });
    });
  });
});
