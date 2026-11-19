import { describe, expect, it } from "vitest";
import { registerSchema } from "../register.schema";

const t = (key: string) => key;
const schema = registerSchema(t);

const validData = {
  username: "username123",
  email: "user@example.com",
  password: "password123",
  confirmed_password: "password123",
};

describe("registerSchema", () => {
  it("should pass with valid data", () => {
    const result = schema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should return valid data on success", () => {
    const result = schema.safeParse(validData);

    expect(result.data).toEqual(validData);
  });

  it("should fail if username field empty", () => {
    const invalidData = { ...validData, username: "" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("username.required");
  });

  it("should fail if username not a string", () => {
    const invalidData = { ...validData, username: 123 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("username.invalid");
  });

  it("should fail if username is non-alphanumeric", () => {
    const invalidData = { ...validData, username: "@invalidUsername" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("username.invalid");
  });

  it("should fail if username is too short", () => {
    const invalidData = { ...validData, username: "ab" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("username.min");
  });

  it("should fail if email field empty", () => {
    const invalidData = { ...validData, email: "" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("email.required");
  });

  it("should fail if email not a string", () => {
    const invalidData = { ...validData, email: 123 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("email.invalid");
  });

  it("should fail with invalid email", () => {
    const invalidData = { ...validData, email: "not an email" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("email.invalid");
  });

  it("should fail if password field empty", () => {
    const invalidData = { ...validData, password: "" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("password.required");
  });

  it("should fail if password not a string", () => {
    const invalidData = { ...validData, password: {} };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("password.invalid");
  });

  it("should fail if password is too short", () => {
    const invalidData = { ...validData, password: "short" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("password.min");
  });

  it("should fail if confirmed_password field empty", () => {
    const invalidData = { ...validData, confirmed_password: "" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("confirmed_password.required");
  });

  it("should fail if confirmed_password not a string", () => {
    const invalidData = { ...validData, confirmed_password: {} };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("confirmed_password.invalid");
  });

  it("should fail if confirmed_password does not match password", () => {
    const invalidData = { ...validData, confirmed_password: "differentPassword" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("password.mismatch");
  });

  it("should fail with multiple validation errors", () => {
    const invalidData = {
      ...validData,
      username: "@invalidUsername",
      email: "not an email",
      password: "short",
    };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);

    const messages = result.error?.issues.map((e) => e.message);
    expect(messages).toContain("username.invalid");
    expect(messages).toContain("email.invalid");
    expect(messages).toContain("password.min");
  });

  it("should fail if extra fields are present", () => {
    const invalidData = { ...validData, extra: "some data" };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('Unrecognized key: "extra"');
  });
});
