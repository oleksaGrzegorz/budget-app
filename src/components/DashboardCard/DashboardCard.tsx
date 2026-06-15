import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
}

export const DashboardCard = ({ children }: DashboardCardProps) => {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </section>
  );
};
