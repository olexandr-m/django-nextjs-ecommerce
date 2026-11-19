import { requiredString } from "./required-string";

describe("requiredString rule", () => {
  const t = (key: string) => key;
  const fieldKey = "test_key";
  const schema = requiredString(t, fieldKey);

  it("should pass for valid string", () => {
    const result = schema.safeParse("valid string");

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("valid string");
  });

  it("should fail if value is undefined", () => {
    const result = schema.safeParse(undefined);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("test_key.invalid");
  });

  it("should fail if value is null", () => {
    const result = schema.safeParse(null);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("test_key.invalid");
  });

  it("should fail if value is not a string", () => {
    const result = schema.safeParse(123);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("test_key.invalid");
  });

  it("should fail if value is empty string", () => {
    const result = schema.safeParse("");

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("test_key.required");
  });

  it("should fail if value is whitespace only", () => {
    const result = schema.safeParse("   ");

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("test_key.required");
  });

  it("should trim string with spaces", () => {
    const result = schema.safeParse("  hello  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");
  });
});
