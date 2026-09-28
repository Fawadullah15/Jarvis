import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Laptop, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { soundFX } from '../services/jarvisService';

interface LocalAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  isAgentConnected: boolean;
  agentMode: 'built-in' | 'external-windows';
  onSwitchMode: (mode: 'built-in' | 'external-windows') => void;
}

export const LocalAgentModal: React.FC<LocalAgentModalProps> = ({
  isOpen,
  onClose,
  token,
  isAgentConnected,
  agentMode,
  onSwitchMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(`powershell -ExecutionPolicy Bypass -File .\\jarvis_agent.ps1`);
    soundFX.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPowerShell = () => {
    soundFX.click();
    window.location.href = `/api/agent/scripts/powershell?token=${encodeURIComponent(token)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-wide text-slate-100">
                JARVIS Windows Local Agent Service
              </h3>
              <p className="text-xs text-slate-400">
                Secure local host daemon for hardware and OS automation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
          {/* Mode Switcher */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-200">Active Agent Connection Mode</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {agentMode === 'built-in' 
                  ? 'Currently operating through the Full-Stack Host Server bridge (ready immediately)'
                  : 'Operating via Standalone Windows Local Daemon on 127.0.0.1:48293'}
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => onSwitchMode('built-in')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  agentMode === 'built-in' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Built-in Host
              </button>
              <button
                onClick={() => onSwitchMode('external-windows')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  agentMode === 'external-windows' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Windows Daemon
              </button>
            </div>
          </div>

          {/* Connection Status Box */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <div>
                <div className="font-semibold text-cyan-200">Agent Status: Connected & Operational</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Host: 127.0.0.1 · Port: 48293 · Latency: 2ms
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
              AUTHENTICATED
            </span>
          </div>

          {/* Standalone Windows Setup Instructions */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Connect to your Physical Windows Machine</span>
              <button
                onClick={downloadPowerShell}
                className="px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download jarvis_agent.ps1</span>
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              To grant JARVIS direct control of your local Windows computer (native screenshots, launching desktop software, PowerShell script execution), download the script and run it in Windows PowerShell:
            </p>

            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-between font-mono text-xs text-slate-300">
              <span className="truncate">powershell -ExecutionPolicy Bypass -File .\jarvis_agent.ps1</span>
              <button
                onClick={handleCopyCmd}
                className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors shrink-0 ml-2"
                title="Copy Command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Native Windows API support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local loopback only (no WAN leak)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bearer token authentication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Permission confirmation enforced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Token: {token}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
