import React, { useMemo } from 'react';
import { JARVISState } from '../types/jarvis';

interface JarvisCoreProps {
  state: JARVISState;
  audioLevel?: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const JarvisCore: React.FC<JarvisCoreProps> = ({
  state,
  audioLevel = 0,
  size = 'md',
  onClick,
}) => {
  // Dimension scale
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { width: 100, height: 100, viewBox: 200 };
      case 'md': return { width: 180, height: 180, viewBox: 300 };
      case 'lg': return { width: 260, height: 260, viewBox: 360 };
      case 'xl': return { width: 340, height: 340, viewBox: 400 };
    }
  }, [size]);

  // Color schemes according to state
  const colors = useMemo(() => {
    switch (state) {
      case 'LISTENING':
        return {
          primary: '#38bdf8', // Sky/Cyan
          secondary: '#0ea5e9',
          accent: '#7dd3fc',
          glow: 'rgba(56, 189, 248, 0.45)',
          speedMultiplier: 1.8,
        };
      case 'THINKING':
        return {
          primary: '#a855f7', // Violet
          secondary: '#818cf8',
          accent: '#c084fc',
          glow: 'rgba(168, 85, 247, 0.45)',
          speedMultiplier: 2.4,
        };
      case 'EXECUTING':
        return {
          primary: '#06b6d4', // Teal/Cyan
          secondary: '#3b82f6',
          accent: '#67e8f9',
          glow: 'rgba(6, 182, 212, 0.5)',
          speedMultiplier: 2.0,
        };
      case 'SPEAKING':
        return {
          primary: '#38bdf8',
          secondary: '#22d3ee',
          accent: '#a5f3fc',
          glow: 'rgba(56, 189, 248, 0.6)',
          speedMultiplier: 1.5,
        };
      case 'ERROR':
        return {
          primary: '#ef4444',
          secondary: '#f43f5e',
          accent: '#fca5a5',
          glow: 'rgba(239, 68, 68, 0.45)',
          speedMultiplier: 0.8,
        };
      case 'IDLE':
      default:
        return {
          primary: '#0284c7',
          secondary: '#38bdf8',
          accent: '#93c5fd',
          glow: 'rgba(2, 132, 199, 0.25)',
          speedMultiplier: 1.0,
        };
    }
  }, [state]);

  const vbCenter = dimensions.viewBox / 2;
  const pulseScale = 1 + (audioLevel * 0.18);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center select-none cursor-pointer transition-transform duration-300 active:scale-95 group"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, rgba(7, 9, 14, 0) 70%)`,
          transform: `scale(${pulseScale * 1.2})`,
          opacity: state === 'IDLE' ? 0.35 : 0.85,
        }}
      />

      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.viewBox} ${dimensions.viewBox}`}
        className="relative z-10 transition-transform duration-300"
        style={{ transform: `scale(${pulseScale})` }}
      >
        <defs>
          <filter id="core-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Track */}
        <circle
          cx={vbCenter}
          cy={vbCenter}
          r={vbCenter * 0.88}
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.75"
          strokeOpacity="0.25"
          strokeDasharray="4 8"
        />

        {/* Counter-rotating Segmented Arc Ring */}
        <g
          className="animate-reverse-spin-slow origin-center"
          style={{
            animationDuration: `${36 / colors.speedMultiplier}s`,
            transformOrigin: `${vbCenter}px ${vbCenter}px`,
          }}
        >
          <circle
            cx={vbCenter}
            cy={vbCenter}
            r={vbCenter * 0.82}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="1.5"
            strokeDasharray="40 25 15 25 60 40"
            filter="url(#core-glow)"
          />
        </g>

        {/* Primary Forward Rotating Fine Geometry Ring */}
        <g
          className="animate-spin-slow origin-center"
          style={{
            animationDuration: `${24 / colors.speedMultiplier}s`,
            transformOrigin: `${vbCenter}px ${vbCenter}px`,
          }}
        >
          <circle
            cx={vbCenter}
            cy={vbCenter}
            r={vbCenter * 0.72}
            fill="none"
            stroke={colors.accent}
            strokeWidth="1.2"
            strokeDasharray="90 30 10 20 40 30"
            strokeOpacity="0.85"
            filter="url(#core-glow)"
          />

          {/* Tick Markers */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const r1 = vbCenter * 0.74;
            const r2 = vbCenter * 0.77;
            const x1 = vbCenter + r1 * Math.cos(rad);
            const y1 = vbCenter + r1 * Math.sin(rad);
            const x2 = vbCenter + r2 * Math.cos(rad);
            const y2 = vbCenter + r2 * Math.sin(rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.primary}
                strokeWidth="1.2"
                strokeOpacity="0.7"
              />
            );
          })}
        </g>

        {/* Middle Luminous Optical Ring */}
        <circle
          cx={vbCenter}
          cy={vbCenter}
          r={vbCenter * 0.58}
          fill="none"
          stroke={colors.secondary}
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Inner Counter Rotating Hex/Octa Pattern */}
        <g
          className="animate-reverse-spin-slow origin-center"
          style={{
            animationDuration: `${16 / colors.speedMultiplier}s`,
            transformOrigin: `${vbCenter}px ${vbCenter}px`,
          }}
        >
          <circle
            cx={vbCenter}
            cy={vbCenter}
            r={vbCenter * 0.46}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeDasharray="25 15 35 15"
            strokeOpacity="0.9"
            filter="url(#core-glow)"
          />
        </g>

        {/* Inner Responsive Core Sphere */}
        <circle
          cx={vbCenter}
          cy={vbCenter}
          r={vbCenter * (0.28 + (audioLevel * 0.08))}
          fill={`radial-gradient(circle, ${colors.accent} 0%, ${colors.primary} 70%, transparent 100%)`}
          fillOpacity={state === 'IDLE' ? 0.3 : 0.65}
          className="transition-all duration-150"
        />

        {/* Micro-center iris node */}
        <circle
          cx={vbCenter}
          cy={vbCenter}
          r={vbCenter * 0.14}
          fill={colors.accent}
          filter="url(#core-glow)"
          className="transition-all duration-200"
          style={{
            opacity: state === 'IDLE' ? 0.7 : 0.95,
          }}
        />

        {/* Subtle horizontal alignment crosshair lines */}
        <line
          x1={vbCenter - 14}
          y1={vbCenter}
          x2={vbCenter + 14}
          y2={vbCenter}
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <line
          x1={vbCenter}
          y1={vbCenter - 14}
          x2={vbCenter}
          y2={vbCenter + 14}
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
      </svg>

      {/* State Badge on hover / active */}
      <div className="absolute -bottom-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 opacity-60 group-hover:opacity-100 bg-slate-900/80 border border-cyan-500/20 text-cyan-300">
        {state}
      </div>
    </div>
  );
};
