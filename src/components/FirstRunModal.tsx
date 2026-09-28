import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Volume2, 
  Laptop, 
  CheckCircle2, 
  Check, 
  FolderPlus,
  Radio
} from 'lucide-react';
import { soundFX } from '../services/jarvisService';
import { JarvisCore } from './JarvisCore';

interface FirstRunModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const FirstRunModal: React.FC<FirstRunModalProps> = ({ isOpen, onFinish }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [allowOpenApps, setAllowOpenApps] = useState(true);
  const [confirmDeletes, setConfirmDeletes] = useState(true);

  if (!isOpen) return null;

  const nextStep = () => {
    soundFX.click();
    if (step < 5) {
      setStep(step + 1);
    } else {
      soundFX.taskComplete();
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-xl rounded-2xl border border-cyan-500/40 overflow-hidden shadow-2xl">
        {/* Step Progress indicator */}
        <div className="flex h-1 bg-slate-900">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-cyan-400' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <JarvisCore state="IDLE" size="lg" />
              </div>
              <h2 className="font-display font-bold text-2xl tracking-wide text-slate-100 mt-2">
                Good day, Fawadullah.
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                I am JARVIS, your personal computer intelligence. I am designed to assist with system operations, terminal workflows, file management, coding, research, and computer automation.
              </p>
            </div>
          )}

          {/* STEP 2: VOICE PERSONA */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Voice Calibration</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-100">Select Acoustic Persona</h3>
              <p className="text-xs text-slate-400">
                Choose the synthetic vocal profile for spoken responses and alerts.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { id: 'Puck', name: 'Puck', desc: 'Calm, refined British intellect' },
                  { id: 'Zephyr', name: 'Zephyr', desc: 'Deep, assertive executive cadence' },
                  { id: 'Fenrir', name: 'Fenrir', desc: 'Resonant, authoritative technical voice' },
                  { id: 'Kore', name: 'Kore', desc: 'Crisp, articulate diagnostic tone' },
                ].map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVoice(v.id);
                      soundFX.hudChime();
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedVoice === v.id
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>{v.name}</span>
                      {selectedVoice === v.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: LOCAL AGENT LINK */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                <Laptop className="w-4 h-4" />
                <span>Local Computer Link</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-100">Local Windows Bridge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                JARVIS operates through a secure local agent. The server host bridge is pre-authenticated on localhost:48293.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Host Protocol</span>
                  <span className="font-mono text-cyan-400">127.0.0.1:48293</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Local Filesystem Access</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mounted (./workspace)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Terminal Subsystem</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PERMISSIONS */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Security Governance</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-100">Set Safety Thresholds</h3>
              <p className="text-xs text-slate-400">
                You maintain complete authority. Configure automated execution versus approval prompts.
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="font-medium text-slate-200">Auto-launch approved applications</div>
                    <div className="text-[11px] text-slate-400">Open VS Code, Chrome, or utilities directly.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowOpenApps}
                    onChange={(e) => setAllowOpenApps(e.target.checked)}
                    className="rounded text-cyan-500 bg-slate-950 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="font-medium text-slate-200">Require approval before deleting files</div>
                    <div className="text-[11px] text-slate-400">Prevent accidental data loss with approval card.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={confirmDeletes}
                    onChange={(e) => setConfirmDeletes(e.target.checked)}
                    className="rounded text-cyan-500 bg-slate-950 border-slate-700"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: READY & HEALTH CHECK */}
          {step === 5 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-100">
                All Subsystems Online
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                AI Neural Brain, Local Agent bridge, and voice interface calibrated. Press Finish to activate your command center.
              </p>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
                Press <span className="text-cyan-400 font-semibold">Ctrl + Space</span> anytime for the Quick Command HUD.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">Step {step} of 5</span>
          <button
            onClick={nextStep}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <span>{step === 5 ? 'Launch JARVIS' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
