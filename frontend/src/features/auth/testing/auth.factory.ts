import { TRegisterSchema } from "../schemas";

export const registerCredentials = (overrides?: Partial<TRegisterSchema>): TRegisterSchema => ({
  username: "testuser",
  email: "test@example.com",
  password: "testpass123",
  confirmed_password: "testpass123",
  ...overrides,
});
