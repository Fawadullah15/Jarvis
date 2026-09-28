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
  FolderOpen,
  Music,
  Video,
  Radio,
  Globe,
  MapPin,
  Mic,
  LogIn,
  LogOut,
  Sliders,
  Database
} from 'lucide-react';
import { ProjectContext } from '../types/jarvis';

interface LeftSidebarProps {
  onNewSession: () => void;
  onRunScenario: (scenarioType: 'demo' | 'slowdown' | 'proposal' | 'screen' | 'clean') => void;
  activeProject: ProjectContext;
  onOpenLocalAgentModal: () => void;
  onOpenDiagnostics: () => void;
  onOpenStudio: (tab?: 'music' | 'video' | 'image' | 'search' | 'maps' | 'transcribe') => void;
  onOpenLiveVoice: () => void;
  isAgentConnected: boolean;
  currentUser: any;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  selectedModel: string;
  onSelectModel: (m: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onNewSession,
  onRunScenario,
  activeProject,
  onOpenLocalAgentModal,
  onOpenDiagnostics,
  onOpenStudio,
  onOpenLiveVoice,
  isAgentConnected,
  currentUser,
  onSignInGoogle,
  onSignOut,
  selectedModel,
  onSelectModel,
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

      {/* User & Firebase Auth Status Bar */}
      <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
        {currentUser ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="User" className="w-6 h-6 rounded-full border border-cyan-400" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200 truncate">{currentUser.displayName || 'Fawadullah'}</div>
                <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" /> Firestore Synced
                </div>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignInGoogle}
            className="w-full py-1.5 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In with Google (Firebase)</span>
          </button>
        )}
      </div>

      {/* Main Nav Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* Live Voice API Launcher */}
        <div>
          <button
            onClick={onOpenLiveVoice}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-sky-950/60 border border-cyan-400/40 hover:border-cyan-400 text-left transition-all group shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-xs text-cyan-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Live Voice Session
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                gemini-3.8-live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Real-time low-latency bi-directional voice dialogue
            </p>
          </button>
        </div>

        {/* Multimodal Studio Hub */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Creation & AI Hub</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => onOpenStudio('music')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-pink-950/30 border border-slate-800 hover:border-pink-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-pink-300"
            >
              <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Music (Lyria)</div>
                <div className="text-[9px] text-slate-500 font-mono">Clip / Pro</div>
              </div>
            </button>

            <button
              onClick={() => onOpenStudio('video')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-indigo-300"
            >
              <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Video (Veo 3)</div>
                <div className="text-[9px] text-slate-500 font-mono">16:9 / 9:16</div>
              </div>
            </button>

            <button
              onClick={() => onOpenStudio('image')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-sky-950/30 border border-slate-800 hover:border-sky-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-sky-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Image & Edit</div>
                <div className="text-[9px] text-slate-500 font-mono">Gemini 3.1</div>
              </div>
            </button>

            <button
              onClick={() => onOpenStudio('transcribe')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-cyan-300"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Transcribe</div>
                <div className="text-[9px] text-slate-500 font-mono">Audio to text</div>
              </div>
            </button>

            <button
              onClick={() => onOpenStudio('search')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-emerald-300"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Search</div>
                <div className="text-[9px] text-slate-500 font-mono">Grounded</div>
              </div>
            </button>

            <button
              onClick={() => onOpenStudio('maps')}
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 text-left transition-colors flex items-center gap-2 text-slate-300 hover:text-amber-300"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-xs truncate">Maps</div>
                <div className="text-[9px] text-slate-500 font-mono">Locations</div>
              </div>
            </button>
          </div>
        </div>

        {/* Model Intelligence Selector */}
        <div>
          <div className="px-2 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Model Tier</span>
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="auto">Auto Intelligence (Dynamic Routing)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex & Coding)</option>
            <option value="gemini-3.5-flash">gemini-3.5-flash (General & Search)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Instant Speed)</option>
            <option value="gemini-3.8-flash">gemini-3.8-flash (Standard Core)</option>
          </select>
        </div>

        {/* Automated Workflows Section */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Workflows</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-1.5">
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
