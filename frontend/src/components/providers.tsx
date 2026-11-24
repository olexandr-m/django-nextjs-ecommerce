"use client";

import { ToastProvider } from "@/components/shared/toast";
import ReduxProvider from "@/lib/redux/provider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ToastProvider>{children}</ToastProvider>
    </ReduxProvider>
  );
}
