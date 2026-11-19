import { ApiResponse } from "@/types";
import { setServerFieldErrors } from "../set-server-field-errors";
import type { UseFormSetError } from "react-hook-form";

interface TestFormValues {
  email: string;
  username: string;
}

const setError = vi.fn() as unknown as UseFormSetError<TestFormValues>;

describe("setServerFieldErrors", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("does nothing if there is no data in response", () => {
    setServerFieldErrors<TestFormValues>(undefined, setError);

    expect(setError).not.toHaveBeenCalled();
  });

  it("does nothing if data has no errors field", () => {
    const error = {
      data: {
        status: 429,
        message: "Too many requests",
      } satisfies ApiResponse,
    };

    setServerFieldErrors<TestFormValues>(error, setError);

    expect(setError).not.toHaveBeenCalled();
  });

  it("sets server validation errors for multiple fields", () => {
    const error = {
      data: {
        status: 400,
        message: "Validation failed",
        errors: {
          email: ["Email already exists"],
          username: ["Username already exists"],
        },
      } satisfies ApiResponse,
    };

    setServerFieldErrors<TestFormValues>(error, setError);

    expect(setError).toHaveBeenCalledTimes(2);
    expect(setError).toHaveBeenCalledWith("email", {
      type: "server",
      message: "Email already exists",
    });
    expect(setError).toHaveBeenCalledWith("username", {
      type: "server",
      message: "Username already exists",
    });
  });

  it("uses only the first message when there are multiple messages for same field", () => {
    const error = {
      data: {
        status: 400,
        message: "Validation failed",
        errors: {
          email: ["Too short", "Invalid format"],
        },
      } satisfies ApiResponse,
    };

    setServerFieldErrors<TestFormValues>(error, setError);

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith("email", {
      type: "server",
      message: "Too short",
    });
  });
});
