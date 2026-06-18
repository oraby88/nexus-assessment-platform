// Scripted discovery Agent (Spec 003 / FR-CA-004, research D1). Deterministic fixed canonical
// sequence, lightly parameterized by use case; answers map to a JobRequirementsProfile. No live model.
import type { AgentTurn, DiscoveryAnswer, JobRequirementsProfile, UseCase } from '@/models';
import { mockRequest } from '@/services/http';
import type { AgentDiscoveryServiceContract } from '@/services/contracts';

interface ScriptQuestion {
  id: string;
  topic: string;
  text: string;
}

const BASE: ScriptQuestion[] = [
  { id: 'role', topic: 'role', text: 'What is the role title and its core purpose?' },
  {
    id: 'responsibilities',
    topic: 'responsibilities',
    text: 'What are the main responsibilities? (comma-separated)',
  },
  {
    id: 'context',
    topic: 'context',
    text: 'Describe the work context — ambiguity, pace, stakeholders.',
  },
  {
    id: 'success',
    topic: 'success',
    text: 'What does success look like in this role? (comma-separated)',
  },
  {
    id: 'risks',
    topic: 'risks',
    text: 'What are the key failure risks or non-negotiables? (comma-separated)',
  },
];

function script(useCase: UseCase): ScriptQuestion[] {
  const extra: ScriptQuestion[] =
    useCase === 'hiring_support'
      ? [
          {
            id: 'rolefit',
            topic: 'rolefit',
            text: 'What differentiates a strong hire for this role?',
          },
        ]
      : [];
  return [...BASE, ...extra];
}

function toTurn(q: ScriptQuestion): AgentTurn {
  return {
    id: q.id,
    sender: 'agent',
    kind: 'question',
    text: q.text,
    topic: q.topic,
    createdAt: '2026-06-15',
  };
}

function splitList(s: string): string[] {
  return s
    ? s
        .split(/[,;]/)
        .map((x) => x.trim())
        .filter(Boolean)
    : [];
}

function buildRequirements(answers: DiscoveryAnswer[], useCase: UseCase): JobRequirementsProfile {
  const get = (id: string) => {
    const a = answers.find((x) => x.questionId === id);
    if (!a) return '';
    return Array.isArray(a.answer) ? a.answer.join(', ') : a.answer;
  };
  return {
    role: get('role') || 'Role',
    jobLevel: 'Professional',
    useCase,
    responsibilities: splitList(get('responsibilities')),
    skills: [],
    behaviors: [],
    contextFactors: splitList(get('context')),
    criticalDimensionIds: ['D1-CE', 'D2-AR', 'D4-SR'],
    successIndicators: splitList(get('success')),
    failureRisks: splitList(get('risks')),
    nonNegotiables: [],
    recommendedFocus: ['D1', 'D2', 'D4'],
    estimatedDurationMinutes: 25,
  };
}

export const agentDiscoveryService = {
  start(useCase: UseCase): Promise<AgentTurn> {
    return mockRequest(() => toTurn(script(useCase)[0]));
  },
  /** Returns the next scripted question (null when complete) and the requirements built so far. */
  next(
    answers: DiscoveryAnswer[],
    useCase: UseCase,
  ): Promise<{ turn: AgentTurn | null; requirements: JobRequirementsProfile }> {
    return mockRequest(() => {
      const q = script(useCase);
      const idx = answers.length;
      return {
        turn: idx < q.length ? toTurn(q[idx]) : null,
        requirements: buildRequirements(answers, useCase),
      };
    });
  },
  summary(answers: DiscoveryAnswer[], useCase: UseCase): Promise<JobRequirementsProfile> {
    return mockRequest(() => buildRequirements(answers, useCase));
  },
} satisfies AgentDiscoveryServiceContract;
