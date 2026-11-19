import { baseApiSlice } from "@/lib/redux/base-api-slice";
import * as T from "../types/api";

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<T.RegisterResponse, T.RegisterData>({
      query: (credentials) => ({
        url: "/auth/register/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApiSlice;
