'use client';

import AppShell from '@/components/AppShell';

/** Tools/Courses pages share the same multi-page shell + bottom nav. */
export default function ToolsChrome({ children }: { children: React.ReactNode }) {
  return (
    <AppShell showFooter={false}>
      <div className="tools-shell tools-shell-embedded">
        <main className="tools-main">{children}</main>
      </div>
    </AppShell>
  );
}
