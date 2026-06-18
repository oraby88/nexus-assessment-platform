// Hand-built SVG chart primitives (FR-FND-006 / task T023). Theme-driven (CSS vars work inside
// inline SVG); each exposes an accessible text alternative (role="img" + aria-label) — constitution XII.
// Spec 010 / US3: signature entrance motion. Resting (un-animated) state equals the final state, and
// the global prefers-reduced-motion rule zeroes animation durations, so reduced-motion users see the
// final shapes/values instantly with no zero/blank frame (FR-016) and aria-labels are unchanged.
import type { CSSProperties } from 'react';
import { CountUp } from '@/components/ui';
import { domainColors } from '@/styles/theme';

interface Bar {
  label: string;
  value: number; // 0..100
  domainId?: string;
}

export function Gauge({
  value,
  label,
  size = 120,
  // Design CAI/DII gauges colour the value arc by risk band; default keeps the indigo look.
  color = 'var(--indigo-500)',
}: {
  value: number;
  label?: string;
  size?: number;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - 16) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const start = -210;
  const end = 30; // 240° sweep
  const angle = start + ((end - start) * v) / 100;
  const polar = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  // The value arc draws in via stroke-dashoffset (pathLength normalized to 100); resting offset is 0
  // (full arc), so reduced-motion shows the completed arc immediately.
  const drawStyle = {
    strokeDasharray: 100,
    animation: 'nx-ring-draw .9s var(--ease-out) both',
    '--nx-ring-circ': 100,
    '--nx-ring-offset': 0,
  } as CSSProperties;
  const arc = (from: number, to: number, color: string, animated = false) => {
    const [x1, y1] = polar(from);
    const [x2, y2] = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        pathLength={animated ? 100 : undefined}
        style={animated ? drawStyle : undefined}
      />
    );
  };
  return (
    <svg width={size} height={size} role="img" aria-label={`${label ?? 'Score'}: ${v} of 100`}>
      {arc(start, end, 'var(--track)')}
      {arc(start, angle, color, true)}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={22}
        fontWeight={700}
        fill="var(--text)"
      >
        <CountUp to={v} />
      </text>
      {label && (
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize={11} fill="var(--text-3)">
          {label}
        </text>
      )}
    </svg>
  );
}

interface RadarAxis {
  axis: string;
  person: number; // 0..100
  required?: number; // 0..100 (FitRadar)
}

function radarPoints(
  axes: RadarAxis[],
  key: 'person' | 'required',
  r: number,
  cx: number,
  cy: number,
) {
  const n = axes.length;
  return axes
    .map((a, i) => {
      const val = (a[key] ?? 0) / 100;
      const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + r * val * Math.cos(ang)},${cy + r * val * Math.sin(ang)}`;
    })
    .join(' ');
}

function Radar({
  axes,
  twoSeries,
  size = 220,
  label,
}: {
  axes: RadarAxis[];
  twoSeries?: boolean;
  size?: number;
  label: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 40) / 2;
  const n = axes.length;
  const summary = axes
    .map((a) => `${a.axis} ${a.person}${twoSeries ? `/${a.required ?? 0}` : ''}`)
    .join(', ');
  return (
    <svg width={size} height={size} role="img" aria-label={`${label}: ${summary}`}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon
          key={g}
          points={axes
            .map((_, i) => {
              const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
              return `${cx + r * g * Math.cos(ang)},${cy + r * g * Math.sin(ang)}`;
            })
            .join(' ')}
          fill="none"
          stroke="var(--border)"
        />
      ))}
      {twoSeries && (
        <polygon
          points={radarPoints(axes, 'required', r, cx, cy)}
          fill="none"
          stroke="var(--amber-600)"
          strokeDasharray="4 3"
          strokeWidth={2}
        />
      )}
      <polygon
        points={radarPoints(axes, 'person', r, cx, cy)}
        fill="color-mix(in srgb, var(--indigo-500) 18%, transparent)"
        stroke="var(--indigo-500)"
        strokeWidth={2}
        // Scale/fade entrance about the chart centre; reduced-motion → final shape instantly.
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'nx-scale-in .5s var(--ease-out) both',
        }}
      />
      {axes.map((a, i) => {
        const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <text
            key={a.axis}
            x={cx + (r + 12) * Math.cos(ang)}
            y={cy + (r + 12) * Math.sin(ang)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill="var(--text-3)"
          >
            {a.axis}
          </text>
        );
      })}
    </svg>
  );
}

export function ContextRadar({ axes }: { axes: RadarAxis[] }) {
  return <Radar axes={axes} label="Context radar" />;
}

export function FitRadar({ axes }: { axes: RadarAxis[] }) {
  return <Radar axes={axes} twoSeries label="Candidate vs context fit" />;
}

export function DimensionBars({ data }: { data: Bar[] }) {
  const summary = data.map((d) => `${d.label} ${d.value}`).join(', ');
  return (
    <div role="img" aria-label={`Dimension scores: ${summary}`} className="grid gap-2">
      {data.map((d, i) => (
        <div
          key={d.label}
          className="grid grid-cols-[120px_1fr_34px] items-center gap-2 text-[13px]"
        >
          <span className="text-text-2">{d.label}</span>
          <span className="h-2 bg-track rounded-full overflow-hidden">
            <span
              className="block h-full"
              // Fill width + domain color computed at runtime; grows from the start edge on entrance
              // (scaleX) with a bounded per-bar stagger; reduced-motion → final width instantly.
              style={{
                width: `${Math.min(100, d.value)}%`,
                background: d.domainId ? domainColors[d.domainId] : 'var(--indigo-500)',
                transformOrigin: 'left',
                animation: 'nx-bar-grow .6s var(--ease-out) both',
                animationDelay: `${(i < 10 ? i : 0) * 60}ms`,
              }}
            />
          </span>
          <span className="text-end text-text-3">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CoverageBars({ data, size = 160 }: { data: Bar[]; size?: number }) {
  const summary = data.map((d) => `${d.label} ${d.value}%`).join(', ');
  const barW = 100 / Math.max(1, data.length);
  return (
    <svg
      width="100%"
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Coverage: ${summary}`}
    >
      {data.map((d, i) => {
        const h = Math.min(100, d.value);
        return (
          <rect
            key={d.label}
            x={i * barW + barW * 0.15}
            y={100 - h}
            width={barW * 0.7}
            height={h}
            fill={d.domainId ? domainColors[d.domainId] : 'var(--teal-500)'}
            rx={1}
            // Grows up from its baseline on entrance (scaleY about the bottom); reduced-motion →
            // final height instantly. Bounded per-bar stagger.
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'bottom',
              animation: 'nx-bar-grow-y .6s var(--ease-out) both',
              animationDelay: `${(i < 10 ? i : 0) * 60}ms`,
            }}
          />
        );
      })}
    </svg>
  );
}

export function ContextSignature({ values, size = 64 }: { values: number[]; size?: number }) {
  const n = values.length;
  const pts = values
    .map((v, i) => `${(i / Math.max(1, n - 1)) * 100},${100 - Math.max(0, Math.min(100, v))}`)
    .join(' ');
  return (
    <svg
      width="100%"
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Context signature across ${n} factors`}
    >
      <polyline
        points={pts}
        fill="none"
        stroke="var(--violet-600)"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        // Scale/fade entrance; reduced-motion → final line instantly.
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'nx-scale-in .5s var(--ease-out) both',
        }}
      />
    </svg>
  );
}
