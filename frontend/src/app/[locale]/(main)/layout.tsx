import React from "react";
import { MainNavbar, MainFooter } from "@/components/layouts/main";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MainNavbar />
      <main style={{ flex: 1, display: "grid" }}>{children}</main>
      <MainFooter />
    </div>
  );
}
