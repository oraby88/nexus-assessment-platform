// Provenance-rich question card (Spec 003 / FR-CA-010). Shows full source metadata + trust badges.
// NEVER shows fabricated weight/difficulty (constitution VI).
import { Card, Chip, TrustBadge, Button } from '@/components/ui';
import type { SelectedQuestion } from '@/models';

export function QuestionCard({
  selected,
  onRemove,
}: {
  selected: SelectedQuestion;
  onRemove?: () => void;
}) {
  const i = selected.item;
  const text = selected.adaptation?.adaptedText ?? i.itemText;
  return (
    <Card className="mb-3">
      <div className="flex gap-2.5 items-start">
        <div className="flex-1">
          <div className="text-xs text-text-3 font-mono">{i.itemId}</div>
          <div className="text-sm my-1.5">{text}</div>
          <div className="flex gap-1.5 flex-wrap mt-2">
            <Chip tone="indigo">{i.domainName}</Chip>
            <Chip tone="slate">{i.dimensionName}</Chip>
            <Chip tone="slate">{i.facetName}</Chip>
            <Chip tone="teal">{i.methodFamily}</Chip>
            <Chip tone="slate">{i.responseScale}</Chip>
            <Chip tone="slate">{i.jobLevelOverlay}</Chip>
            <Chip tone="slate">{i.bankState}</Chip>
            <Chip tone="slate">{i.useStatus}</Chip>
            <Chip tone="slate">{i.reviewStatus}</Chip>
          </div>
          <div className="flex gap-1.5 flex-wrap mt-2">
            <Chip tone="teal">Selected From Governed Bank</Chip>
            <TrustBadge />
          </div>
          <div className="text-xs text-text-3 mt-2">
            Covers: {selected.requirementCovered} — {selected.selectionReason}
          </div>
        </div>
        {onRemove && (
          <Button variant="ghost" onClick={onRemove} aria-label={`Remove ${i.itemId}`}>
            Remove
          </Button>
        )}
      </div>
    </Card>
  );
}
