import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Domain6Section } from '@/features/reports/Domain6Section';
import { reports } from '@/mocks/reports';

// FR-RPT-003 / SC-003
describe('Domain6Section (FR-RPT-003)', () => {
  it('renders CAI/DII, the six indices, and a Derailment-blocked note', () => {
    const d6 = reports.find((r) => r.domain6)!.domain6!;
    render(<Domain6Section d6={d6} />);
    expect(screen.getByText(/CAI/)).toBeInTheDocument();
    expect(screen.getByText(/DII/)).toBeInTheDocument();
    expect(screen.getByText(/AFI/)).toBeInTheDocument();
    expect(screen.getByText(/ECSI/)).toBeInTheDocument();
    expect(screen.getByText(/Derailment Risk is blocked/)).toBeInTheDocument();
  });

  it('shows provisional reasons for a provisional report', () => {
    const d6 = reports.find((r) => r.domain6?.confidence === 'Provisional')!.domain6!;
    render(<Domain6Section d6={d6} />);
    expect(screen.getByText(/Provisional:/)).toBeInTheDocument();
  });
});
