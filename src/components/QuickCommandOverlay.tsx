import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  FolderPlus, 
  Play, 
  Globe, 
  Eye, 
  X, 
  Mic, 
  Sparkles,
  Command
} from 'lucide-react';
import { soundFX } from '../services/jarvisService';

interface QuickCommandOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: string) => void;
  onToggleVoice: () => void;
  isListening: boolean;
}

export const QuickCommandOverlay: React.FC<QuickCommandOverlayProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onToggleVoice,
  isListening,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundFX.hudChime();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      onSubmit(query.trim());
      onClose();
    }
  };

  const quickActions = [
    { label: 'Open VS Code', icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" />, cmd: 'Open Visual Studio Code' },
    { label: 'Create Folder', icon: <FolderPlus className="w-3.5 h-3.5 text-emerald-400" />, cmd: 'Create a new project folder called AI Workspace on my desktop' },
    { label: 'Inspect Screen', icon: <Eye className="w-3.5 h-3.5 text-violet-400" />, cmd: 'Take a screenshot of my desktop and summarize what is currently on my screen' },
    { label: 'Diagnose CPU', icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />, cmd: 'Why is my computer slow? Inspect processes and report' },
    { label: 'Research AI Tools', icon: <Globe className="w-3.5 h-3.5 text-indigo-400" />, cmd: 'Research the top AI developer tools and prepare a brief comparison' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-xl rounded-2xl border border-cyan-500/40 overflow-hidden shadow-2xl">
        {/* Input Bar */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800 bg-slate-950/60">
          <Command className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="What can I do for you?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />

          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300'
            }`}
            title="Toggle Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="p-3 bg-slate-900/40 text-xs">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 px-1">
            Rapid Commands
          </div>
          <div className="space-y-1">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSubmit(action.cmd);
                  onClose();
                }}
                className="w-full p-2 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-slate-300 hover:text-cyan-200 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  {action.icon}
                  <span className="font-medium text-xs">{action.label}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{action.cmd}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
          <span>Enter to execute · Esc to dismiss</span>
          <span>Ctrl + Space</span>
        </div>
      </div>
    </div>
  );
};
