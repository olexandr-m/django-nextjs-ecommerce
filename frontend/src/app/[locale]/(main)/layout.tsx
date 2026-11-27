import React from "react";
import { MainNavbar, MainFooter, MobileMenuSidebar, ScrollToTopButton } from "@/components/layouts/main";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MainNavbar />
      <MobileMenuSidebar />
      <main style={{ flex: 1, display: "grid" }}>{children}</main>
      <ScrollToTopButton />
      <MainFooter />
    </div>
  );
}
