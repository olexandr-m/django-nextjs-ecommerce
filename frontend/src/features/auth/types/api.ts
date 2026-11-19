import { ApiResponse } from "@/types";
import { User } from "./models";

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmed_password: string;
}
export type RegisterResponse = ApiResponse<{ user: User }>;
