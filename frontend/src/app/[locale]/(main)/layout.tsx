import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1, display: "grid" }}>{children}</main>
    </div>
  );
}
