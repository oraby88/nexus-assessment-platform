// Bulk Upload modal (US1 / FR-ADM-004): stepper template → upload → validate → preview → confirm → summary.
import { useState } from 'react';
import { Modal, Button, Stepper, TextArea, StatusBadge } from '@/components/ui';
import { useToast } from '@/hooks';
import { participantService } from '@/services';
import { toCsv } from '@/lib/csv';
import type { BulkUploadResult } from '@/models';

const TEMPLATE_COLUMNS = [
  'Full Name',
  'Email',
  'Current Job Title',
  'Target Job Title',
  'Job Level',
  'Department',
  'Notes',
];
const STEPS = ['Template', 'Upload', 'Preview', 'Done'];

const SAMPLE = toCsv(
  [
    { 'Full Name': 'Jamie Rivera', Email: 'jamie.rivera@meridian.co', 'Job Level': 'Professional' },
    { 'Full Name': 'Sam Lee', Email: 'sam.lee@meridian.co', 'Job Level': 'Manager' },
  ],
  TEMPLATE_COLUMNS,
);

export function BulkUploadModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [csv, setCsv] = useState('');
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [busy, setBusy] = useState(false);

  function reset() {
    setStep(0);
    setCsv('');
    setResult(null);
    setImportedCount(0);
  }
  function close() {
    reset();
    onClose();
  }

  function downloadTemplate() {
    const blob = new Blob([toCsv([], TEMPLATE_COLUMNS)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus-users-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function validate() {
    setBusy(true);
    const r = await participantService.bulkUpload(csv);
    setResult(r);
    setStep(2);
    setBusy(false);
  }

  async function confirmImport() {
    if (!result) return;
    setBusy(true);
    const added = await participantService.confirmImport(result.valid);
    setImportedCount(added.length);
    setStep(3);
    setBusy(false);
    onImported();
    toast(`${added.length} users imported`, 'success');
  }

  return (
    <Modal open={open} onClose={close} title="Bulk Upload Users">
      <div className="mb-4">
        <Stepper steps={STEPS} current={step} />
      </div>

      {step === 0 && (
        <div>
          <p className="text-sm text-text-2 mb-3">
            Download the CSV template. Required columns:{' '}
            <strong>Full Name, Email, Job Level</strong>.
          </p>
          <div className="flex gap-2.5">
            <Button variant="secondary" onClick={downloadTemplate}>
              Download template
            </Button>
            <Button onClick={() => setStep(1)}>Next</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-sm text-text-2 mb-2">Paste CSV content (or use the sample):</p>
          <TextArea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            aria-label="CSV content"
            className="min-h-[140px] font-mono text-xs"
          />
          <div className="flex gap-2.5 mt-3">
            <Button variant="secondary" onClick={() => setCsv(SAMPLE)}>
              Use sample
            </Button>
            <Button onClick={validate} disabled={busy || !csv.trim()}>
              {busy ? 'Validating…' : 'Validate'}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div>
          <div className="flex gap-2.5 mb-3">
            <StatusBadge status="Completed" />{' '}
            <span className="text-sm">{result.valid.length} valid</span>
            <span className="text-sm text-rose-600">{result.invalid.length} invalid</span>
            <span className="text-sm text-amber-600">{result.duplicate.length} duplicate</span>
          </div>
          {[...result.invalid, ...result.duplicate].length > 0 && (
            <ul className="text-[13px] text-text-2 max-h-[140px] overflow-y-auto mb-3 ps-4">
              {[...result.invalid, ...result.duplicate].map((r) => (
                <li key={`${r.status}-${r.row}`}>
                  Row {r.row}: {r.status} — {r.reasons?.join(', ')}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2.5">
            <Button onClick={confirmImport} disabled={busy || result.valid.length === 0}>
              {busy ? 'Importing…' : `Import ${result.valid.length} valid`}
            </Button>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-[15px] mb-3">✓ Imported {importedCount} users successfully.</p>
          <Button onClick={close}>Done</Button>
        </div>
      )}
    </Modal>
  );
}
