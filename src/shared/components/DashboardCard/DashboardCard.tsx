import type { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export const DashboardCard = ({
  title,
  subtitle,
  children,
}: DashboardCardProps) => {
  const hasHeader = title || subtitle;

  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {hasHeader && (
        <>
          <div className="mb-5">
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-red-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-0.5 text-xs font-semibold text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mb-5 h-px bg-slate-100" />
        </>
      )}

      {children}
    </section>
  );
};