import { useEffect, useState } from 'react';
import type { ToastType } from '@/hooks';

interface ToastItem {
  id: number;
  title: string;
  type: ToastType;
  body?: string;
}

const colors: Record<ToastType, string> = {
  success: 'var(--teal-500)',
  info: 'var(--indigo-500)',
  caution: 'var(--amber-600)',
  error: 'var(--rose-600)',
};

let seq = 0;

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent).detail as Omit<ToastItem, 'id'>;
      const id = ++seq;
      setItems((xs) => [...xs, { id, ...detail }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3600);
    };
    window.addEventListener('nx-toast', onToast);
    return () => window.removeEventListener('nx-toast', onToast);
  }, []);

  return (
    <div aria-live="polite" className="fixed end-4 bottom-4 flex flex-col gap-2 z-[1000]">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="bg-surface border border-border border-s-[3px] rounded-md shadow-lg py-2.5 px-3.5 min-w-[240px]"
          // Accent color is tone-driven (runtime); applied to the logical start border, plus the keyframe animation string — both kept inline.
          style={{
            borderInlineStartColor: colors[t.type],
            animation: 'nx-fade-up .25s var(--ease-out) both',
          }}
        >
          <div className="font-semibold text-sm">{t.title}</div>
          {t.body && <div className="text-[13px] text-text-2 mt-0.5">{t.body}</div>}
        </div>
      ))}
    </div>
  );
}
