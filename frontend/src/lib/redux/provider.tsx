"use client";

import { AppStore, makeStore } from "@/lib/redux/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

interface ProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ProviderProps) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    return setupListeners(store.dispatch);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
