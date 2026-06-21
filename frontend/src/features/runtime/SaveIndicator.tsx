// Auto-save status (Spec 006 / US1 / FR-USR-010). Reflects saving vs last-saved; never blocks input.
// Icons match the design (user_assessment.jsx): refresh while saving, check when saved — rendered
// statically (no spin) to stay reduced-motion-safe (constitution XII).
import { useT } from '@/hooks';
import { Icon, check, refresh } from '@/components/ui/icons';

export function SaveIndicator({ saving, lastSavedAt }: { saving: boolean; lastSavedAt?: string }) {
  const { t } = useT();
  return (
    <span
      role="status"
      aria-live="polite"
      className="text-xs text-text-3 inline-flex gap-1.5 items-center"
    >
      {saving ? (
        <>
          <Icon path={refresh} size={13} />
          {t('runtime.saving')}
        </>
      ) : lastSavedAt ? (
        <>
          <Icon path={check} size={14} />
          {t('runtime.saved')}
        </>
      ) : (
        <>{t('runtime.autoSaveOn')}</>
      )}
    </span>
  );
}
