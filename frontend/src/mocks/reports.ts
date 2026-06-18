// Dedicated full report fixtures (Spec 005 / research D2). Hand-authored to cover every visibility
// and Domain 6 state: High/Moderate/Low/Unacceptable confidence, an omitted section, a blocked
// Derailment Risk, and complete Domain 6 incl. a provisional case. The frontend does NO scoring —
// these are the inputs the (future) scoring/Domain 6 services would produce.
import type { Domain6Result, Report } from '@/models';

function domain6(confident: boolean): Domain6Result {
  return {
    cai: confident ? 78 : 61,
    dii: confident ? 72 : 55,
    caiBand: confident ? 'Strong alignment' : 'Mixed alignment',
    confidence: confident ? 'High' : 'Provisional',
    narrative: confident
      ? 'Strong person-in-context alignment for the target role and environment.'
      : 'Contextual alignment is provisional pending restricted inputs.',
    secondaryIndices: [
      {
        code: 'AFI',
        name: 'Ambiguity Fit',
        score: confident ? 74 : 60,
        type: 'fit',
        confidence: confident ? 'High' : 'Moderate',
      },
      {
        code: 'ECFI',
        name: 'Execution-Context Fit',
        score: confident ? 70 : 58,
        type: 'fit',
        confidence: confident ? 'High' : 'Moderate',
      },
      {
        code: 'SII',
        name: 'Stakeholder Influence',
        score: confident ? 68 : 54,
        type: 'fit',
        confidence: confident ? 'High' : 'Low',
      },
      {
        code: 'DDI',
        name: 'Decision Discipline',
        score: confident ? 75 : undefined,
        type: 'fit',
        confidence: confident ? 'High' : 'Low',
        visibility: confident ? 'visible' : 'downgraded',
        explanation: confident ? undefined : 'Downgraded — insufficient inputs',
      },
      {
        code: 'PDRI',
        name: 'Pressure Distortion Risk',
        score: confident ? 28 : undefined,
        type: 'risk',
        confidence: confident ? 'High' : 'Low',
        visibility: confident ? 'visible' : 'hidden',
        explanation: confident ? undefined : 'Hidden — low confidence',
      },
      {
        code: 'ECSI',
        name: 'Ethical Constraint Stability',
        score: confident ? 82 : 70,
        type: 'fit',
        confidence: confident ? 'High' : 'Moderate',
      },
    ],
    radar: [
      { axis: 'Ambiguity', person: confident ? 75 : 60, required: 70 },
      { axis: 'Stakes', person: confident ? 80 : 62, required: 75 },
      { axis: 'Pace', person: confident ? 70 : 58, required: 65 },
      { axis: 'Autonomy', person: confident ? 78 : 64, required: 72 },
      { axis: 'Stakeholders', person: confident ? 72 : 55, required: 70 },
    ],
    contextStrengths: confident
      ? ['Operates well under ambiguity', 'Strong stakeholder navigation']
      : ['Tentative fit signals where data permits'],
    contextCautions: confident
      ? ['Watch pace under sustained load']
      : ['Several outputs provisional'],
    provisionalReasons: confident
      ? undefined
      : ['Domain 3 (Drivers) restricted', 'Domain 5 (Workplace) insufficient coverage'],
    derailmentRiskBlocked: true,
  };
}

function dims(band: 'High' | 'Moderate' | 'Low', se: number) {
  return [
    {
      domainId: 'D1' as const,
      label: 'Character & Work Style',
      dimensions: [
        {
          dimensionId: 'D1-CE',
          dimensionName: 'Conscientious Execution',
          score: 78,
          confidence: band,
          scoreBand: 'Strong' as const,
          standardError: se,
        },
      ],
    },
    {
      domainId: 'D2' as const,
      label: 'Thinking & Problem Solving',
      dimensions: [
        {
          dimensionId: 'D2-AR',
          dimensionName: 'Abstract Reasoning',
          score: 64,
          confidence: band,
          scoreBand: 'Effective' as const,
          standardError: se,
        },
      ],
    },
    {
      domainId: 'D4' as const,
      label: 'Emotional Intelligence & Relationships',
      dimensions: [
        {
          dimensionId: 'D4-SR',
          dimensionName: 'Self-Regulation',
          score: 71,
          confidence: band,
          scoreBand: 'Effective' as const,
          standardError: se,
        },
      ],
    },
  ];
}

export const reports: Report[] = [
  {
    id: 'RPT-001',
    participantId: 'CND-2041',
    organizationId: 'org-meridian',
    assessmentId: 'ASN-001',
    useCase: 'hiring_support',
    targetRole: 'Finance Manager',
    completedAt: '2026-06-08',
    status: 'Released',
    confidence: 'High',
    omittedSections: [],
    domains: dims('High', 0.2),
    strengths: [{ dimensionId: 'D1-CE', text: 'Reliably follows through on commitments.' }],
    areasToExplore: [
      { dimensionId: 'D2-AR', text: 'Explore approach to novel analytical problems.' },
    ],
    domain6: domain6(true),
    interviewPrompts: [
      { dimensionId: 'D1-CE', question: 'Describe a commitment you kept under pressure.' },
    ],
    limitations: ['Single assessment occasion.'],
    scoringVersion: 'score-v2.1',
    synthesisWeightVersion: 'synth-v1.4',
    blueprintId: 'BP-001',
    contextProfileId: 'CX-001',
    blueprintVersion: '1.2',
    contextVersion: '1.1',
  },
  {
    id: 'RPT-002',
    participantId: 'CND-2045',
    organizationId: 'org-meridian',
    assessmentId: 'ASN-005',
    useCase: 'hiring_support',
    targetRole: 'Sales Manager',
    completedAt: '2026-06-09',
    status: 'Released with Caution',
    confidence: 'Moderate',
    omittedSections: [
      { name: 'Drivers & Motivation', reason: 'Restricted domain (D3) — insufficient inputs' },
    ],
    domains: dims('Moderate', 0.32),
    strengths: [{ text: 'Strong customer orientation.' }],
    areasToExplore: [{ text: 'Confidence is moderate; corroborate with interview.' }],
    domain6: domain6(true),
    interviewPrompts: [{ question: 'Walk through a deal you turned around.' }],
    limitations: ['Moderate confidence — interpret with caution in hiring context.'],
    scoringVersion: 'score-v2.1',
    synthesisWeightVersion: 'synth-v1.4',
    blueprintId: 'BP-003',
    contextProfileId: 'CX-002',
    blueprintVersion: '0.3',
    contextVersion: '1.0',
  },
  {
    id: 'RPT-003',
    participantId: 'CND-2047',
    organizationId: 'org-meridian',
    assessmentId: 'ASN-007',
    useCase: 'developmental',
    targetRole: 'Head of People',
    completedAt: '2026-06-07',
    status: 'Partial Release',
    confidence: 'Low',
    omittedSections: [
      { name: 'Workplace Effectiveness', reason: 'Low confidence — downgraded' },
      { name: 'Derailment Risk', reason: 'Blocked value — never shown as data' },
    ],
    domains: dims('Low', 0.42),
    strengths: [{ text: 'Empathetic communicator.' }],
    areasToExplore: [{ text: 'Several outputs downgraded due to low confidence.' }],
    domain6: domain6(false),
    interviewPrompts: [{ question: 'How do you build trust with a new team?' }],
    limitations: ['Low confidence across several dimensions; treat as developmental only.'],
    scoringVersion: 'score-v2.0',
    synthesisWeightVersion: 'synth-v1.3',
    blueprintId: 'BP-002',
    contextProfileId: 'CX-002',
    blueprintVersion: '1.0',
    contextVersion: '1.0',
  },
  {
    id: 'RPT-004',
    participantId: 'CND-2049',
    organizationId: 'org-meridian',
    assessmentId: 'ASN-009',
    useCase: 'hiring_support',
    targetRole: 'VP Operations',
    completedAt: '2026-06-06',
    status: 'Released',
    confidence: 'High',
    omittedSections: [],
    domains: dims('High', 0.18),
    strengths: [{ dimensionId: 'D4-SR', text: 'Composed under pressure.' }],
    areasToExplore: [{ text: 'Stretch on cross-functional ambiguity.' }],
    domain6: domain6(true),
    interviewPrompts: [{ question: 'Describe leading through a major operational change.' }],
    limitations: ['Single assessment occasion.'],
    scoringVersion: 'score-v2.1',
    synthesisWeightVersion: 'synth-v1.4',
    blueprintId: 'BP-001',
    contextProfileId: 'CX-001',
    blueprintVersion: '1.2',
    contextVersion: '1.1',
  },
];
