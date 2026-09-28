import { SystemTelemetry, HealthCheckItem, ChatMessage, Task, TaskStep, MemoryItem, AutomationRule, PermissionSettings } from '../types/jarvis';

// Sound effects synthesizer using Web Audio API
class AudioFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.05) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  hudChime() {
    this.playTone(880, 'sine', 0.15, 0.04);
    setTimeout(() => this.playTone(1320, 'sine', 0.2, 0.04), 80);
  }

  activation() {
    this.playTone(440, 'triangle', 0.1, 0.05);
    setTimeout(() => this.playTone(660, 'sine', 0.15, 0.05), 60);
    setTimeout(() => this.playTone(1100, 'sine', 0.25, 0.06), 130);
  }

  taskComplete() {
    this.playTone(523.25, 'sine', 0.12, 0.05);
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80);
    setTimeout(() => this.playTone(1046.5, 'sine', 0.3, 0.06), 160);
  }

  alert() {
    this.playTone(440, 'sawtooth', 0.15, 0.06);
    setTimeout(() => this.playTone(330, 'sawtooth', 0.25, 0.06), 120);
  }

  click() {
    this.playTone(1400, 'sine', 0.04, 0.02);
  }
}

export const soundFX = new AudioFX();

// API calls to local agent & server
export async function getSystemTelemetry(): Promise<SystemTelemetry> {
  const res = await fetch('/api/agent/system');
  if (!res.ok) throw new Error('Failed to fetch system telemetry');
  return res.json();
}

export async function getHealthDiagnostics(): Promise<Record<string, HealthCheckItem>> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Failed to fetch health status');
  const data = await res.json();
  return data.components;
}

export async function executeAgentTool(tool: string, params: Record<string, any> = {}) {
  const res = await fetch('/api/agent/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, params }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Tool execution request failed' }));
    throw new Error(err.error || 'Execution failed');
  }
  return res.json();
}

export async function sendChatMessage(messages: ChatMessage[], context?: any) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Chat API error' }));
    throw new Error(err.error || 'Chat request failed');
  }
  return res.json();
}

export async function analyzeScreenVision(imageBase64: string, prompt?: string) {
  const res = await fetch('/api/vision/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, prompt }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Vision API error' }));
    throw new Error(err.error || 'Vision analysis failed');
  }
  return res.json();
}

export async function requestTTS(text: string, voice = 'Puck'): Promise<string | null> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.audioBase64 || null;
  } catch {
    return null;
  }
}

// Speak helper using Gemini TTS or Web Speech fallback
export async function speakJARVIS(text: string, onStart?: () => void, onEnd?: () => void) {
  onStart?.();
  const base64Audio = await requestTTS(text);

  if (base64Audio) {
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    audio.onended = () => onEnd?.();
    audio.onerror = () => {
      fallbackWebSpeech(text, onEnd);
    };
    audio.play().catch(() => {
      fallbackWebSpeech(text, onEnd);
    });
    return;
  }

  fallbackWebSpeech(text, onEnd);
}

function fallbackWebSpeech(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;
  // Try to find a distinguished British or English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.name.includes('British') || 
    v.name.includes('UK') || 
    v.name.includes('George') || 
    v.name.includes('Daniel') || 
    v.lang === 'en-GB'
  ) || voices.find(v => v.lang.startsWith('en'));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

// Initial default memories
export const defaultMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'Preferences',
    key: 'Assistant Persona',
    value: 'Concise, calm, respectful, British-accented cadence. Minimal chatter.',
    updatedAt: Date.now() - 604800000,
  },
  {
    id: 'mem-2',
    category: 'Work Context',
    key: 'Primary User',
    value: 'Fawadullah. Senior Developer & Systems Engineer.',
    updatedAt: Date.now() - 604800000,
  },
  {
    id: 'mem-3',
    category: 'Preferences',
    key: 'Programming Stack',
    value: 'TypeScript, Python, React, PowerShell, Docker, FastAPI.',
    updatedAt: Date.now() - 302400000,
  },
  {
    id: 'mem-4',
    category: 'Projects',
    key: 'AI Workspace Path',
    value: 'Desktop/AI Workspace - designated directory for automated builds & scripts.',
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'mem-5',
    category: 'Instructions',
    key: 'Verification Policy',
    value: 'Always verify file creation, directory presence, and exit codes before declaring success.',
    updatedAt: Date.now() - 86400000,
  }
];

export const defaultPermissions: PermissionSettings = {
  autoAllowOpenApps: true,
  alwaysAskFileDelete: true,
  alwaysAskTerminalCommands: false,
  alwaysAskProcessStop: true,
  trustedWorkspacePaths: ['Desktop/AI Workspace', 'workspace', 'C:\\Users\\User\\Desktop'],
};
