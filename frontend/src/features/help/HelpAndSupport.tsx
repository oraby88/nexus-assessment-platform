// Help & Support (Spec 006 / US6 / FR-USR-016). FAQ, runtime guidance, contact, privacy questions.
import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { PageHeader } from '@/features/placeholder';
import { useToast } from '@/hooks';

const FAQ: [string, string][] = [
  [
    'Can I pause and come back?',
    'Yes. Use “Save & exit” during the assessment — your progress is saved and you’ll resume where you left off.',
  ],
  [
    'Will I see my score?',
    'No. The assessment does not show a score. Results are reviewed and shared separately if applicable.',
  ],
  [
    'What if my connection drops?',
    'Your answers are saved automatically on your device. Reload the page and continue.',
  ],
  [
    'How is my data used?',
    'Only for the purpose you consented to. You can review or revoke consent in Profile & Privacy.',
  ],
  [
    'How do the question types work?',
    'You’ll see agreement and frequency scales, choice questions, and short scenarios. Pick the option that fits you best.',
  ],
];

export function HelpAndSupport() {
  const { toast } = useToast();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <PageHeader title="Help & Support" sub="Answers and ways to reach us" />
      <Card className="mb-4">
        <h2 className="text-base mb-2">Frequently asked questions</h2>
        <div className="grid gap-1.5">
          {FAQ.map(([q, a], i) => (
            <div key={q} className="border-t border-border pt-2">
              <button
                onClick={() => setOpen((o) => (o === i ? null : i))}
                aria-expanded={open === i}
                className="flex w-full justify-between bg-transparent border-none text-sm font-semibold text-start text-text py-1"
              >
                {q}
                <span aria-hidden>{open === i ? '–' : '+'}</span>
              </button>
              {open === i && <p className="text-sm text-text-2 mt-1 mb-2">{a}</p>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base mb-2">Contact support</h2>
        <p className="text-sm text-text-2 mb-3">
          Questions about the assessment, accessibility needs, or privacy? We’re here to help.
        </p>
        <div className="flex gap-2.5 flex-wrap">
          <Button onClick={() => toast('Support request sent — we’ll reply by email.', 'success')}>
            Contact support
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast('Privacy request noted — see Profile & Privacy.', 'info')}
          >
            Ask a privacy question
          </Button>
        </div>
      </Card>
    </div>
  );
}
