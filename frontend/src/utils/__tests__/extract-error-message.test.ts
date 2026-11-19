import type { ApiResponse } from "@/types";
import { extractErrorMessage } from "../extract-error-message";

describe("extractErrorMessage", () => {
  it("returns a default message if the error structure is invalid", () => {
    expect(extractErrorMessage(null)).toBe("An unexpected error occurred");
    expect(extractErrorMessage({})).toBe("An unexpected error occurred");
  });

  it("returns top-level message if there is no errors object", () => {
    const error = {
      data: {
        status: 400,
        message: "Some error message.",
      } satisfies ApiResponse,
    };

    expect(extractErrorMessage(error)).toBe("Some error message.");
  });

  it("returns top-level message if errors object is empty", () => {
    const error = {
      data: {
        status: 400,
        message: "Some error message.",
        errors: {},
      } satisfies ApiResponse,
    };

    expect(extractErrorMessage(error)).toBe("Some error message.");
  });

  it("returns first validation error message", () => {
    const error = {
      data: {
        status: 400,
        message: "Validation failed.",
        errors: {
          password: ["Password too short.", "Password must contain a number."],
        },
      } satisfies ApiResponse,
    };

    expect(extractErrorMessage(error)).toBe("Password too short.");
  });
});
