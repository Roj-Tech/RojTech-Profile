'use client';

/** Consistent top spacing for standalone section pages */
export default function PageFrame({ children }: { children: React.ReactNode }) {
  return <div className="page-frame">{children}</div>;
}
