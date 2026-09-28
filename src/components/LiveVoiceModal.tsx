import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  Sparkles, 
  PhoneOff, 
  Sliders, 
  Cpu, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { soundFX, speakJARVIS, sendChatMessage } from '../services/jarvisService';
import { JarvisCore } from './JarvisCore';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchComputerAction: (command: string) => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onDispatchComputerAction,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('Listening... Speak naturally to JARVIS.');
  const [audioLevel, setAudioLevel] = useState(0.4);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    soundFX.activation();
    startLiveVoiceSession();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isOpen]);

  const startLiveVoiceSession = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setAudioLevel(0.65);
      };

      recognition.onresult = async (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        setLiveTranscript(transcript);

        if (lastResult.isFinal) {
          setIsListening(false);
          setIsSpeaking(true);
          setAudioLevel(0.85);

          // Fast chat reply
          try {
            const chatRes = await sendChatMessage(
              [{ id: 'live-1', sender: 'user', text: transcript, timestamp: Date.now() }],
              undefined,
              'gemini-3.1-flash-lite'
            );

            const reply = chatRes.text || "Command acknowledged, Fawadullah.";
            setLiveTranscript(reply);

            speakJARVIS(
              reply,
              () => setIsSpeaking(true),
              () => {
                setIsSpeaking(false);
                setIsListening(true);
                setAudioLevel(0.3);
              }
            );

            // If user asked to do something on PC, dispatch action
            if (
              transcript.toLowerCase().includes('open') || 
              transcript.toLowerCase().includes('create') || 
              transcript.toLowerCase().includes('screenshot')
            ) {
              onDispatchComputerAction(transcript);
            }
          } catch {
            setIsSpeaking(false);
            setIsListening(true);
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isOpen) {
          try { recognition.start(); } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-xl rounded-3xl border border-cyan-500/40 overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.25)] flex flex-col items-center p-8 text-center relative">
        
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">
              Live API Channel · gemini-3.8-live
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.click();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Luminous Core Visual */}
        <div className="my-6">
          <JarvisCore
            state={isSpeaking ? 'SPEAKING' : isListening ? 'LISTENING' : 'IDLE'}
            audioLevel={audioLevel}
            size="xl"
          />
        </div>

        {/* Live Audio Visualizer Bars */}
        <div className="flex items-center justify-center gap-1.5 h-12 my-2">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-sky-300 transition-all duration-75"
              style={{
                height: `${Math.max(8, Math.random() * (audioLevel * 45 + 10))}px`,
                opacity: isListening || isSpeaking ? 0.9 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Subtitle / Transcript Banner */}
        <div className="max-w-md my-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm leading-relaxed font-medium">
          {liveTranscript}
        </div>

        <div className="text-[11px] font-mono text-slate-400 max-w-sm leading-relaxed mb-6">
          Real-time low-latency bi-directional voice stream. Speak commands such as <span className="text-cyan-300">"JARVIS, open VS Code"</span> or ask any question.
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFX.alert();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Live Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
