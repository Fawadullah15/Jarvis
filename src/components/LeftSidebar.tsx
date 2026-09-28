import React from 'react';
import { 
  Sparkles, 
  Plus, 
  FolderGit2, 
  TerminalSquare, 
  PlayCircle, 
  Cpu, 
  FileText, 
  Clock, 
  Layers, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { ProjectContext } from '../types/jarvis';

interface LeftSidebarProps {
  onNewSession: () => void;
  onRunScenario: (scenarioType: 'demo' | 'slowdown' | 'proposal' | 'screen' | 'clean') => void;
  activeProject: ProjectContext;
  onOpenLocalAgentModal: () => void;
  onOpenDiagnostics: () => void;
  isAgentConnected: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onNewSession,
  onRunScenario,
  activeProject,
  onOpenLocalAgentModal,
  onOpenDiagnostics,
  isAgentConnected,
}) => {
  return (
    <aside className="w-72 bg-[#090d16]/95 border-r border-cyan-500/15 flex flex-col h-full select-none shrink-0 z-20">
      {/* Header Branding */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            <span className="font-display font-bold text-sm tracking-wider text-cyan-400">J</span>
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-widest text-slate-100 flex items-center gap-1.5">
              JARVIS
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.6
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">Computer Intelligence</div>
          </div>
        </div>

        <button
          onClick={onNewSession}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 hover:border-cyan-500/40 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-colors"
          title="New Assistant Session"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Nav Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        
        {/* Demonstration & Core Workflows Section */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Automated Workflows</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-1.5">
            {/* Core Section 48 Scenario */}
            <button
              onClick={() => onRunScenario('demo')}
              className="w-full text-left p-2.5 rounded-lg bg-cyan-950/20 hover:bg-cyan-900/30 border border-cyan-500/30 hover:border-cyan-400/60 text-slate-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  Full Section 48 Demo
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                Desktop folder → VS Code → hello.py → Run → Screenshot → Vision inspect
              </p>
            </button>

            <button
              onClick={() => onRunScenario('slowdown')}
              className="w-full text-left p-2 rounded-lg bg-slate-900/40 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>"Why is my computer slow?"</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Inspect processes, CPU spikes & recommendations
              </p>
            </button>

            <button
              onClick={() => onRunScenario('proposal')}
              className="w-full text-left p-2 rounded-lg bg-slate-900/40 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                <span>Create Client Proposal</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Research company, calculate estimates & generate doc
              </p>
            </button>

            <button
              onClick={() => onRunScenario('screen')}
              className="w-full text-left p-2 rounded-lg bg-slate-900/40 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>"What is on my screen?"</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Multimodal screenshot analysis & UI guidance
              </p>
            </button>
          </div>
        </div>

        {/* Project Context Mode Section */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Project Mode</span>
            <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
          </div>

          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/90 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 truncate">{activeProject.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeProject.gitBranch || 'main'}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{activeProject.activePath}</span>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Stack: {activeProject.technology}</span>
              <span className="text-cyan-400">{activeProject.files.length} tracked files</span>
            </div>
          </div>
        </div>

        {/* Scheduled Automations Preview */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Automations</span>
            <Clock className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="p-2 rounded bg-slate-900/30 border border-slate-800/60">
              <div className="font-medium text-slate-300">08:00 AM Daily Briefing</div>
              <div className="text-[10px] text-slate-500 mt-0.5">CPU check & agenda summary</div>
            </div>
            <div className="p-2 rounded bg-slate-900/30 border border-slate-800/60">
              <div className="font-medium text-slate-300">Friday 17:00 Weekly Digest</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Workspace report & git log</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Local Agent Connection Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div 
          onClick={onOpenLocalAgentModal}
          className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAgentConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-ping'}`} />
              <span className="text-xs font-semibold text-slate-200">Local Agent Bridge</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 group-hover:underline">Setup</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span>Mode: {isAgentConnected ? 'HOST LINKED' : 'STANDBY'}</span>
            <span className="text-[10px] text-slate-500">Port 48293</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <button 
            onClick={onOpenDiagnostics}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono text-[10px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Diagnostics
          </button>
          <span className="font-mono text-[10px] text-slate-500">Ctrl+Space</span>
        </div>
      </div>
    </aside>
  );
};
