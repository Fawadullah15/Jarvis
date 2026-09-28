import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Cpu, 
  FolderCheck, 
  Terminal, 
  Globe, 
  Mic, 
  Database, 
  CalendarClock 
} from 'lucide-react';
import { HealthCheckItem } from '../types/jarvis';
import { soundFX } from '../services/jarvisService';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics: Record<string, HealthCheckItem>;
  onRunDiagnostics: () => Promise<void>;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  diagnostics,
  onRunDiagnostics,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsRunning(true);
    soundFX.click();
    await onRunDiagnostics();
    soundFX.taskComplete();
    setIsRunning(false);
  };

  const getStatusBadge = (status: HealthCheckItem['status']) => {
    switch (status) {
      case 'working':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Working
          </span>
        );
      case 'needs-setup':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Needs Setup
          </span>
        );
      case 'unavailable':
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Unavailable
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-wide text-slate-100">
                JARVIS Health Center & Diagnostics
              </h3>
              <p className="text-xs text-slate-400">
                Comprehensive subsystem connectivity & API telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Probing...' : 'Run Diagnostics'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnostics Subsystems Grid */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {Object.entries(diagnostics).map(([key, item]) => (
            <div
              key={key}
              className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5 max-w-md">
                <div className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <span>{item.name}</span>
                </div>
                <div className="text-slate-400 text-xs">{item.details}</div>
              </div>

              <div>{getStatusBadge(item.status)}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">System: Nominal · Protocol 127.0.0.1</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
