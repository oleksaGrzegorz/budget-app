import type { ReactNode } from "react";

interface AppLayoutProps {
  theme: "light" | "dark";
  children: ReactNode;
}

export const AppLayout = ({ theme, children }: AppLayoutProps) => {
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-300 text-slate-800"
      }`}
    >
      <main className="mx-auto max-w-screen-2xl space-y-10 px-6 py-10">
        {children}
      </main>
    </div>
  );
};