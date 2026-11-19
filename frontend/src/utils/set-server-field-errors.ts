import { ApiResponse } from "@/types";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function setServerFieldErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  const serverData = (error as { data?: ApiResponse<any> })?.data;

  if (!serverData?.errors) return;

  Object.entries(serverData.errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      type: "server",
      message: messages[0],
    });
  });
}
