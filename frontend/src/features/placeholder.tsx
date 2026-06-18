import type { ReactNode } from 'react';
import { Card, EmptyState } from '@/components/ui';

// Page header (design app/ui.jsx PageHeader): title + sub on the left, optional action cluster right.
export function PageHeader({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">{title}</h1>
        {sub && <p className="text-text-2 mt-1 text-sm">{sub}</p>}
      </div>
      {actions && <div className="flex gap-2.5 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
}

/** Generic placeholder for routes scaffolded but not yet built in this increment. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <Card>
        <EmptyState
          title={`${title} — scaffolded`}
          sub="This route is wired in the shell. Its feature spec (specs/001–008) drives the next implementation pass."
        />
      </Card>
    </div>
  );
}
