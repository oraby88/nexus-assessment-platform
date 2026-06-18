// Auto-save status (Spec 006 / US1 / FR-USR-010). Reflects saving vs last-saved; never blocks input.
import { useT } from '@/hooks';

export function SaveIndicator({ saving, lastSavedAt }: { saving: boolean; lastSavedAt?: string }) {
  const { t } = useT();
  return (
    <span role="status" aria-live="polite" className="text-xs text-text-3 inline-flex gap-1.5">
      {saving ? (
        <>● {t('runtime.saving')}</>
      ) : lastSavedAt ? (
        <>✓ {t('runtime.saved')}</>
      ) : (
        <>{t('runtime.autoSaveOn')}</>
      )}
    </span>
  );
}
