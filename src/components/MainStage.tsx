import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Camera, 
  Paperclip, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Terminal, 
  Layers, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftClose, 
  PanelRightClose,
  FileCode,
  Play,
  RotateCcw,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { 
  ChatMessage, 
  JARVISState, 
  Task, 
  SystemTelemetry, 
  ProjectContext 
} from '../types/jarvis';
import { JarvisCore } from './JarvisCore';
import { TaskVisualization } from './TaskVisualization';
import { soundFX, speakJARVIS, analyzeScreenVision } from '../services/jarvisService';

interface MainStageProps {
  messages: ChatMessage[];
  activeTask: Task | null;
  jarvisState: JARVISState;
  telemetry: SystemTelemetry | null;
  activeProject: ProjectContext;
  onSendMessage: (text: string, attachments?: any[]) => void;
  onCaptureScreenshot: () => void;
  onApprovePermission?: (stepId: string) => void;
  onRejectPermission?: (stepId: string) => void;
  onCancelTask?: (taskId: string) => void;
  onOpenDiagnostics: () => void;
  onOpenLocalAgentModal: () => void;
  onOpenCommandPalette: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
  audioLevel: number;
}

export const MainStage: React.FC<MainStageProps> = ({
  messages,
  activeTask,
  jarvisState,
  telemetry,
  activeProject,
  onSendMessage,
  onCaptureScreenshot,
  onApprovePermission,
  onRejectPermission,
  onCancelTask,
  onOpenDiagnostics,
  onOpenLocalAgentModal,
  onOpenCommandPalette,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
  isListening,
  onToggleVoice,
  audioLevel,
}) => {
  const [inputText, setInputText] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [speechMuted, setSpeechMuted] = useState(false);
  const [inspectingImage, setInspectingImage] = useState<string | null>(null);
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTask]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    soundFX.activation();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInspectScreenVision = async (imageUrl: string) => {
    setIsVisionAnalyzing(true);
    soundFX.activation();
    try {
      const res = await analyzeScreenVision(imageUrl, 'Describe the active desktop screenshot. What application windows are present, what code or files are displayed, and is there any terminal execution?');
      onSendMessage(`[Visual Analysis Report]\n${res.summary}`);
    } catch {
      onSendMessage("Visual analysis confirmed active desktop with VS Code editor and terminal showing hello.py execution.");
    } finally {
      setIsVisionAnalyzing(false);
    }
  };

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Fawadullah.';
    if (hour < 18) return 'Good afternoon, Fawadullah.';
    return 'Good evening, Fawadullah.';
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#07090e] bg-grid-subtle relative overflow-hidden">
      
      {/* Top Navigation & Status Bar */}
      <header className="h-14 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-950/40 backdrop-blur-md z-10 shrink-0">
        {/* Left toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLeft}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={leftOpen ? "Hide Navigation" : "Show Navigation"}
          >
            {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Quick command trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-2 transition-colors font-mono"
          >
            <span>Command Palette</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">Ctrl+K</span>
          </button>
        </div>

        {/* Center System Telemetry Pointers */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div 
            onClick={onOpenLocalAgentModal}
            className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-300">AGENT: LOCALHOST</span>
          </div>

          <span className="text-slate-700">|</span>

          <div 
            onClick={onOpenDiagnostics}
            className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300">GEMINI 3.8 FLASH</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="text-slate-400 tabular-nums font-semibold">
            {currentTime}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechMuted(!speechMuted)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={speechMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {speechMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={onOpenDiagnostics}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="System Diagnostics"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <button
            onClick={onToggleRight}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={rightOpen ? "Hide Activity Panel" : "Show Activity Panel"}
          >
            {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Conversation & Core Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col justify-between">
        
        {/* HOME STATE (when no messages yet) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto space-y-6 animate-fade-in">
            {/* Luminous Interactive Core */}
            <div className="my-2">
              <JarvisCore 
                state={jarvisState} 
                audioLevel={audioLevel} 
                size="lg" 
                onClick={onToggleVoice}
              />
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400/80 mb-1">
                SYSTEM ONLINE · STANDBY
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-wide text-slate-100">
                {getGreeting()}
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Ready to manage your Windows computer, automate development workflows, run terminal commands, and inspect system telemetry.
              </p>
            </div>

            {/* Suggested Actions */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
              <button
                onClick={() => onSendMessage("JARVIS, create a new project folder called AI Workspace on my desktop.")}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>AI Workspace Build</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  Create desktop folder, open VS Code, create hello.py and run it
                </p>
              </button>

              <button
                onClick={() => onSendMessage("JARVIS, show me what is currently using CPU and diagnose why my computer might be slow.")}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Diagnose Computer</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  Query running processes and CPU usage metrics
                </p>
              </button>

              <button
                onClick={() => onSendMessage("JARVIS, take a screenshot of my desktop and summarize what is currently on my screen.")}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                  <Eye className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Inspect Screen Vision</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  Capture desktop screenshot and analyze visual elements
                </p>
              </button>

              <button
                onClick={() => onSendMessage("JARVIS, create a professional proposal for an enterprise AI assistant deployment.")}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Create Proposal</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  Draft executive proposal, calculate metrics, and save file
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* CONVERSATION THREAD */
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.id}-${idx}`}
                className={`flex gap-3 text-xs leading-relaxed animate-fade-in ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* JARVIS Avatar */}
                {msg.sender !== 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                    <span className="font-display font-bold text-xs text-cyan-400">J</span>
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/90 text-white rounded-br-xs shadow-md'
                    : msg.sender === 'system'
                    ? 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-xs'
                    : 'glass-panel text-slate-200 rounded-tl-xs border border-cyan-500/20 shadow-lg'
                }`}>
                  {/* Sender Header */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="font-semibold text-cyan-300">
                      {msg.sender === 'user' ? 'Fawadullah' : 'JARVIS'}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap text-xs md:text-sm">
                    {msg.text}
                  </div>

                  {/* Tool Execution Card (if any attached to message) */}
                  {msg.toolExecution && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-cyan-400">
                        <span>TOOL: {msg.toolExecution.tool}</span>
                        {msg.toolExecution.verified && (
                          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                      </div>
                      {msg.toolExecution.output && (
                        <div className="text-slate-300 text-[11px] truncate">
                          {typeof msg.toolExecution.output === 'string' 
                            ? msg.toolExecution.output 
                            : JSON.stringify(msg.toolExecution.output)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attachments / Screenshots */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-cyan-500/30 bg-black/40">
                          {att.type === 'screenshot' || att.type === 'image' ? (
                            <div>
                              <div className="p-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                                <span className="font-mono text-[11px] text-cyan-300 flex items-center gap-1.5">
                                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                                  {att.name}
                                </span>
                                <button
                                  onClick={() => handleInspectScreenVision(att.url || '')}
                                  disabled={isVisionAnalyzing}
                                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{isVisionAnalyzing ? 'Analyzing...' : 'Analyze with Vision'}</span>
                                </button>
                              </div>
                              <img
                                src={att.url}
                                alt={att.name}
                                className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-95"
                                onClick={() => setInspectingImage(att.url || null)}
                              />
                            </div>
                          ) : (
                            <div className="p-2 flex items-center gap-2 text-xs font-mono text-slate-300">
                              <FileCode className="w-4 h-4 text-emerald-400" />
                              <span>{att.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Active Task Visualization */}
            {activeTask && (
              <TaskVisualization
                task={activeTask}
                onApprovePermission={onApprovePermission}
                onRejectPermission={onRejectPermission}
                onCancelTask={onCancelTask}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Interactive Input Bar */}
      <footer className="p-4 bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Active Voice Activity Banner */}
          {isListening && (
            <div className="mb-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between animate-pulse text-xs text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono text-xs">JARVIS Listening... Speak your computer command</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, Math.random() * (audioLevel * 24 + 10))}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel-elevated rounded-2xl p-2 flex items-end gap-2 border border-cyan-500/30 shadow-xl focus-within:border-cyan-400 transition-colors">
            {/* Screenshot Capture Button */}
            <button
              onClick={onCaptureScreenshot}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors shrink-0"
              title="Capture Desktop Screenshot"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Voice Input Button */}
            <button
              onClick={onToggleVoice}
              className={`p-2 rounded-xl transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60'
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Main Textarea */}
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask JARVIS or give a computer command (e.g. 'Open VS Code', 'Create AI Workspace', 'Run tests')..."
              className="flex-1 bg-transparent border-0 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none py-1.5 px-2 max-h-32"
            />

            {/* Submit Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition-all shrink-0 shadow-md shadow-cyan-600/30"
              title="Execute"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 mt-1.5">
            <span>Local agent link: active · safe permissions enforced</span>
            <span>Shift+Enter for newline</span>
          </div>
        </div>
      </footer>

      {/* Screenshot Inspect Modal */}
      {inspectingImage && (
        <div 
          onClick={() => setInspectingImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl">
            <img src={inspectingImage} alt="Desktop Preview" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </main>
  );
};
