// Scripted discovery chat (Spec 003 / FR-CA-004). Deterministic; updates the live requirements
// profile per answer; no live model call.
// Spec 012 (T027): visual parity with project/app/create_assessment2.jsx DiscoveryChat — agent-avatar
// header, AI/user chat bubbles, animated typing dots + a thinking pulse ring. The infinite nx-typing/
// nx-pulse animations are zeroed by the global prefers-reduced-motion rule (constitution XII).
import { useEffect, useRef, useState } from 'react';
import { Button, TextArea } from '@/components/ui';
import { Icon, sparkles, send } from '@/components/ui/icons';
import { agentDiscoveryService } from '@/services';
import type { AgentTurn, DiscoveryAnswer, JobRequirementsProfile, UseCase } from '@/models';

type Msg = { from: 'ai' | 'user'; text: string; section?: string };
const clean = (t: string) => t.replace(/\*\*/g, '');

/** The discovery agent's identity badge (gradient + sparkles). When `thinking`, a pulsing ring
 *  surrounds it (design create_assessment2.jsx; nx-pulse is zeroed under reduced-motion). */
function AgentAvatar({ size = 34, thinking = false }: { size?: number; thinking?: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid place-items-center flex-none rounded-[11px]"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(140deg,#4F46E5,#3730A3)',
        boxShadow: '0 4px 12px -2px rgba(79,70,229,.5)',
      }}
    >
      <Icon path={sparkles} size={Math.round(size * 0.5)} style={{ color: '#fff' }} />
      {thinking && (
        <span
          className="absolute rounded-[13px]"
          style={{
            inset: -3,
            border: '2px solid var(--indigo-300)',
            animation: 'nx-pulse 1.2s infinite',
          }}
        />
      )}
    </span>
  );
}

export function DiscoveryChat({
  useCase,
  onRequirements,
  onComplete,
}: {
  useCase: UseCase;
  onRequirements: (r: JobRequirementsProfile) => void;
  onComplete: (r: JobRequirementsProfile, answers: DiscoveryAnswer[]) => void;
}) {
  const [turn, setTurn] = useState<AgentTurn | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(true);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    agentDiscoveryService.start(useCase).then((t) => {
      setTurn(t);
      setMessages([{ from: 'ai', text: clean(t.text), section: t.topic }]);
      setBusy(false);
    });
  }, [useCase]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  async function submit() {
    if (!turn || !input.trim() || busy) return;
    const text = input.trim();
    const ans: DiscoveryAnswer = {
      questionId: turn.id,
      topic: turn.topic ?? turn.id,
      answer: text,
      answeredAt: '2026-06-16',
    };
    const nextAnswers = [...answers, ans];
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setBusy(true);
    const res = await agentDiscoveryService.next(nextAnswers, useCase);
    onRequirements(res.requirements);
    setBusy(false);
    if (res.turn) {
      setTurn(res.turn);
      setMessages((m) => [
        ...m,
        { from: 'ai', text: clean(res.turn!.text), section: res.turn!.topic },
      ]);
    } else {
      setTurn(null);
      setDone(true);
      setMessages((m) => [
        ...m,
        {
          from: 'ai',
          text: "Perfect — I have everything I need. I've assembled your Job Requirements Profile from your answers. Let's review it.",
        },
      ]);
      onComplete(res.requirements, nextAnswers);
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* agent header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
        <AgentAvatar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[14.5px] font-bold">
            Nexus Discovery Agent
            <span
              className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--teal-50)', color: 'var(--teal-700)' }}
            >
              ● ONLINE
            </span>
          </div>
          <div className="text-xs text-text-3">
            Interviewing you about the role — selects only from the governed bank
          </div>
        </div>
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-5"
        style={{ background: 'var(--canvas)' }}
      >
        {messages.map((m, i) =>
          m.from === 'ai' ? (
            <div key={i} className="flex gap-3 mb-4 max-w-[680px]">
              <AgentAvatar size={32} />
              <div className="min-w-0">
                {m.section && (
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-indigo-400 mb-1.5">
                    {m.section}
                  </div>
                )}
                <div
                  className="text-[14.5px] leading-relaxed px-4 py-3"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px 16px 16px 16px',
                    boxShadow: 'var(--sh-xs)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end mb-4">
              <div
                className="max-w-[520px] text-[14.5px] leading-snug px-4 py-3 text-white"
                style={{
                  background: 'var(--indigo-500)',
                  borderRadius: '16px 4px 16px 16px',
                  boxShadow: 'var(--sh-indigo)',
                }}
              >
                {m.text}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex gap-3 mb-4">
            <AgentAvatar size={32} thinking />
            <div
              className="flex gap-1 px-4 py-3.5"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px 16px 16px 16px',
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-[7px] h-[7px] rounded-full"
                  style={{
                    background: 'var(--indigo-400)',
                    animation: `nx-typing 1.3s ${d * 0.16}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <div className="flex gap-2.5 items-end p-4 border-t border-border">
        <div className="flex-1">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={
              done ? 'Discovery complete — continue to the summary →' : 'Type your answer…'
            }
            disabled={done}
            aria-label="Your answer"
          />
        </div>
        <Button icon={send} onClick={submit} disabled={done || busy || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
