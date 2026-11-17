export type ToastVariant = "default" | "success" | "error" | "info";

export type ToastType = {
  id: string;
  message: string;
  type: ToastVariant;
  duration: number;
};

export const toastStyles: Record<ToastVariant, string> = {
  default: "bg-gray-800 text-white",
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};
