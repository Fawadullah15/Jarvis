import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  FileText, 
  FolderPlus, 
  Cpu, 
  Settings, 
  Database, 
  Activity, 
  X,
  Code,
  Globe
} from 'lucide-react';
import { soundFX } from '../services/jarvisService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string, payload?: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundFX.click();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = [
    { id: 'open-app', title: 'Open Application', icon: <Terminal className="w-4 h-4 text-cyan-400" />, desc: 'Launch VS Code, Chrome, or Windows terminal', cmd: 'Open Visual Studio Code' },
    { id: 'search-files', title: 'Search Local Files', icon: <Search className="w-4 h-4 text-sky-400" />, desc: 'Scan workspace directory for files & scripts', cmd: 'Search files for hello.py' },
    { id: 'start-task', title: 'Run Section 48 Demo Scenario', icon: <Activity className="w-4 h-4 text-emerald-400" />, desc: 'Folder creation → code build → test → screenshot', cmd: 'DEMO_SCENARIO' },
    { id: 'create-doc', title: 'Create Document or Proposal', icon: <FileText className="w-4 h-4 text-violet-400" />, desc: 'Generate business proposal or technical report', cmd: 'Create a professional proposal' },
    { id: 'diagnose-cpu', title: 'Diagnose Computer Slowdown', icon: <Cpu className="w-4 h-4 text-rose-400" />, desc: 'Inspect processes and identify CPU hogs', cmd: 'Why is my computer slow?' },
    { id: 'view-memory', title: 'View Persistent Memory', icon: <Database className="w-4 h-4 text-amber-400" />, desc: 'Inspect remembered preferences & project context', cmd: 'VIEW_MEMORY' },
    { id: 'open-settings', title: 'Open Security & Agent Settings', icon: <Settings className="w-4 h-4 text-slate-400" />, desc: 'Configure safety thresholds & agent connection', cmd: 'OPEN_SETTINGS' },
  ];

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-lg rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="p-3.5 flex items-center gap-3 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => {
                  onSelectAction(item.cmd);
                  onClose();
                }}
                className="p-2.5 rounded-lg hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/30 flex items-center justify-between cursor-pointer transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between px-3">
          <span>Navigate with mouse or click</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
