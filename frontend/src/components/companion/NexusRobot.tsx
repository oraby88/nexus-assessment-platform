// The animated Nexus robot (ported from design landing.jsx). Shared by the cinematic landing hero
// and the Nex companion orb. `compact` drops the aura/orbiting-nodes/float so it sits cleanly inside
// a small fixed-size container (the companion uses compact); both consumers are lazy-loaded chunks.
import { useEffect, useState } from 'react';

const NODE_COLORS = ['#6366F1', '#14B8A6', '#7C3AED', '#C2820B', '#0EA5E9', '#4F46E5'];

export function NexusRobot({ size = 300, compact = false }: { size?: number; compact?: boolean }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        animation: compact ? 'none' : 'nx-robot-float 6s ease-in-out infinite',
      }}
    >
      {!compact && (
        <div
          style={{
            position: 'absolute',
            inset: '-12%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,.42), rgba(13,148,136,.14) 45%, transparent 68%)',
            filter: 'blur(6px)',
            animation: 'nx-aura-pulse 4s ease-in-out infinite',
          }}
        />
      )}
      {!compact &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              animation: `nx-spin ${22 + i * 2}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: `${50 - 46 * Math.cos((i / 6) * Math.PI * 2)}%`,
                left: `${50 + 46 * Math.sin((i / 6) * Math.PI * 2)}%`,
                transform: 'translate(-50%,-50%)',
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: NODE_COLORS[i],
                boxShadow: `0 0 14px 2px ${NODE_COLORS[i]}`,
              }}
            />
          </div>
        ))}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          position: 'relative',
          zIndex: 2,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.55))',
        }}
      >
        <defs>
          <linearGradient id="rbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EEF1FF" />
            <stop offset="0.5" stopColor="#C9D0F2" />
            <stop offset="1" stopColor="#9AA6D8" />
          </linearGradient>
          <linearGradient id="rface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10162A" />
            <stop offset="1" stopColor="#1B2348" />
          </linearGradient>
          <linearGradient id="rvisor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#14B8A6" />
          </linearGradient>
          <radialGradient id="reye" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#A5F3EC" />
            <stop offset="0.5" stopColor="#22D3C4" />
            <stop offset="1" stopColor="#0D9488" />
          </radialGradient>
        </defs>
        <line
          x1="100"
          y1="34"
          x2="100"
          y2="16"
          stroke="#9AA6D8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="12" r="5" fill="#6366F1">
          <animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="12" r="9" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity=".5">
          <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".6;0;.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <path
          d="M54 168 Q54 138 100 138 Q146 138 146 168 L146 184 Q146 190 140 190 L60 190 Q54 190 54 184 Z"
          fill="url(#rbody)"
        />
        <rect x="86" y="128" width="28" height="20" rx="8" fill="#B5BEE6" />
        <circle cx="100" cy="170" r="9" fill="url(#rvisor)" opacity=".9" />
        <circle cx="100" cy="170" r="4" fill="#0B1020" />
        <rect
          x="48"
          y="36"
          width="104"
          height="92"
          rx="30"
          fill="url(#rbody)"
          stroke="#fff"
          strokeWidth="1"
          strokeOpacity=".4"
        />
        <rect x="40" y="66" width="12" height="32" rx="6" fill="#9AA6D8" />
        <rect x="148" y="66" width="12" height="32" rx="6" fill="#9AA6D8" />
        <circle cx="46" cy="82" r="3" fill="#14B8A6" />
        <circle cx="154" cy="82" r="3" fill="#14B8A6" />
        <rect x="60" y="52" width="80" height="60" rx="22" fill="url(#rface)" />
        <rect
          x="60"
          y="52"
          width="80"
          height="60"
          rx="22"
          fill="none"
          stroke="url(#rvisor)"
          strokeWidth="1.5"
          strokeOpacity=".6"
        />
        <rect x="60" y="52" width="80" height="3" fill="#22D3C4" opacity=".5">
          <animate attributeName="y" values="56;106;56" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".0;.55;.0" dur="3.4s" repeatCount="indefinite" />
        </rect>
        <g
          transform={blink ? 'scale(1,0.1)' : 'scale(1,1)'}
          style={{ transformOrigin: '85px 80px', transition: 'transform .1s' }}
        >
          <ellipse cx="85" cy="80" rx="9" ry={blink ? 1.5 : 10} fill="url(#reye)" />
          <circle cx="83" cy="77" r="2.6" fill="#EAFFFD" opacity=".9" />
        </g>
        <g
          transform={blink ? 'scale(1,0.1)' : 'scale(1,1)'}
          style={{ transformOrigin: '115px 80px', transition: 'transform .1s' }}
        >
          <ellipse cx="115" cy="80" rx="9" ry={blink ? 1.5 : 10} fill="url(#reye)" />
          <circle cx="113" cy="77" r="2.6" fill="#EAFFFD" opacity=".9" />
        </g>
        <path
          d="M90 98 Q100 104 110 98"
          stroke="#22D3C4"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity=".8"
        />
      </svg>
    </div>
  );
}
