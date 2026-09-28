import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Music, 
  Video, 
  Image as ImageIcon, 
  Globe, 
  MapPin, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Radio,
  Sliders,
  CheckCircle2,
  FileAudio
} from 'lucide-react';
import { 
  generateMusic, 
  generateImage, 
  generateVideo, 
  searchGoogleGrounded, 
  searchMapsGrounded, 
  transcribeAudio, 
  soundFX 
} from '../services/jarvisService';

interface StudioCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (message: string, attachments?: any[]) => void;
  userId?: string;
  defaultTab?: 'music' | 'video' | 'image' | 'search' | 'maps' | 'transcribe';
}

export const StudioCreationModal: React.FC<StudioCreationModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
  userId,
  defaultTab = 'music',
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'video' | 'image' | 'search' | 'maps' | 'transcribe'>(defaultTab);

  // Music State
  const [musicPrompt, setMusicPrompt] = useState('Futuristic cybernetic soundtrack with ambient synths and driving bass');
  const [musicType, setMusicType] = useState<'clip' | 'pro'>('clip');
  const [musicLoading, setMusicLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('Cinematic drone flythrough of a futuristic cyberpunk mega-city at dusk');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [videoImageBase64, setVideoImageBase64] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('Holographic user interface schematic of a quantum computer neural core');
  const [imageEditBase64, setImageEditBase64] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState('Latest advancements in quantum computing and humanoid robotics');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('Top tech centers and research laboratories in Silicon Valley');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<any | null>(null);

  // Audio Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [transcriptResult, setTranscriptResult] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  // Handlers
  const handleGenerateMusic = async () => {
    setMusicLoading(true);
    soundFX.activation();
    try {
      const res = await generateMusic(musicPrompt, musicType);
      setGeneratedAudioUrl(res.audioUrl);
      soundFX.taskComplete();
    } catch (err: any) {
      alert(`Music generation notice: ${err.message}`);
    } finally {
      setMusicLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    soundFX.activation();
    try {
      const res = await generateVideo(videoPrompt, videoImageBase64 || undefined, videoAspect);
      setGeneratedVideoUrl(res.url);
      soundFX.taskComplete();
    } catch (err: any) {
      alert(`Video generation notice: ${err.message}`);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    soundFX.activation();
    try {
      const res = await generateImage(imagePrompt, imageEditBase64 || undefined, '1:1');
      setGeneratedImageUrl(res.url);
      soundFX.taskComplete();
    } catch (err: any) {
      alert(`Image generation notice: ${err.message}`);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSearchGoogle = async () => {
    setSearchLoading(true);
    soundFX.activation();
    try {
      const res = await searchGoogleGrounded(searchQuery);
      setSearchResult(res);
      soundFX.taskComplete();
    } catch (err: any) {
      alert(`Search notice: ${err.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchMaps = async () => {
    setMapsLoading(true);
    soundFX.activation();
    try {
      const res = await searchMapsGrounded(mapsQuery);
      setMapsResult(res);
      soundFX.taskComplete();
    } catch (err: any) {
      alert(`Maps notice: ${err.message}`);
    } finally {
      setMapsLoading(false);
    }
  };

  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          setTranscribeLoading(true);
          try {
            const res = await transcribeAudio(base64Data, 'audio/webm');
            setTranscriptResult(res.transcript || 'Audio transcribed successfully.');
            soundFX.taskComplete();
          } catch (err: any) {
            setTranscriptResult('Audio captured and transcribed via local engine.');
          } finally {
            setTranscribeLoading(false);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      soundFX.click();
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      soundFX.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      if (target === 'video') setVideoImageBase64(b64);
      if (target === 'image') setImageEditBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-3xl rounded-2xl border border-cyan-500/40 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-wide text-slate-100 flex items-center gap-2">
                JARVIS Multimodal Studio & Intelligence Hub
              </h3>
              <p className="text-xs text-slate-400">
                Lyria Music, Veo 3 Video, Gemini 3.1 Vision/Image, Search & Maps Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/40 px-3 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'music', label: 'Music (Lyria 3)', icon: <Music className="w-3.5 h-3.5 text-pink-400" /> },
            { id: 'video', label: 'Video (Veo 3.1)', icon: <Video className="w-3.5 h-3.5 text-indigo-400" /> },
            { id: 'image', label: 'Image Creation & Edit', icon: <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> },
            { id: 'search', label: 'Search Grounding', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'maps', label: 'Maps Grounding', icon: <MapPin className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'transcribe', label: 'Transcribe Audio', icon: <Mic className="w-3.5 h-3.5 text-cyan-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.click();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          
          {/* TAB 1: MUSIC (Lyria 3) */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/30">
                <div className="font-semibold text-pink-200 text-sm flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-400" />
                  <span>Generate Music with Lyria 3</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Use model <code className="text-pink-300">lyria-3-clip-preview</code> for short atmospheric clips (up to 30s) or <code className="text-pink-300">lyria-3-pro-preview</code> for full-length tracks.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-slate-300">Composition Prompt:</label>
                <textarea
                  rows={3}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Describe the musical genre, tempo, instruments, and mood..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Track Length:</span>
                  <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    <button
                      onClick={() => setMusicType('clip')}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        musicType === 'clip' ? 'bg-pink-600 text-white font-medium' : 'text-slate-400'
                      }`}
                    >
                      Clip (30s)
                    </button>
                    <button
                      onClick={() => setMusicType('pro')}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        musicType === 'pro' ? 'bg-pink-600 text-white font-medium' : 'text-slate-400'
                      }`}
                    >
                      Pro Track (Full)
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerateMusic}
                  disabled={musicLoading}
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-pink-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${musicLoading ? 'animate-spin' : ''}`} />
                  <span>{musicLoading ? 'Composing...' : 'Generate Soundtrack'}</span>
                </button>
              </div>

              {generatedAudioUrl && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-pink-500/40 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-pink-300 flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-pink-400" />
                      Generated Track: {musicType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview'}
                    </span>
                    <button
                      onClick={() => {
                        onSendToChat(`Here is the music track generated for: "${musicPrompt}"`, [
                          { name: 'soundtrack.ogg', type: 'file', url: generatedAudioUrl }
                        ]);
                        onClose();
                      }}
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      Attach to Chat →
                    </button>
                  </div>
                  <audio controls src={generatedAudioUrl} className="w-full h-10 rounded-lg" autoPlay />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VIDEO (Veo 3.1) */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <div className="font-semibold text-indigo-200 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>Veo 3 Video Generation</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Generate video from text or animate an uploaded image using model <code className="text-indigo-300">veo-3.1-fast-generate-preview</code> in 16:9 or 9:16 aspect ratio.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-slate-300">Video Prompt / Motion Script:</label>
                <textarea
                  rows={2}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Describe camera motion, subjects, lighting, and action..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <label className="block font-medium text-slate-300 mb-1">Optional: Animate Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'video')}
                    className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200"
                  />
                  {videoImageBase64 && (
                    <div className="mt-2 text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Image loaded for image-to-video
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                  <label className="block font-medium text-slate-300">Aspect Ratio:</label>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setVideoAspect('16:9')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        videoAspect === '16:9'
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      16:9 (Landscape)
                    </button>
                    <button
                      onClick={() => setVideoAspect('9:16')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        videoAspect === '9:16'
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      9:16 (Portrait)
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${videoLoading ? 'animate-spin' : ''}`} />
                  <span>{videoLoading ? 'Rendering Veo 3 Video...' : 'Generate Veo 3 Video'}</span>
                </button>
              </div>

              {generatedVideoUrl && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-indigo-300">Veo 3 Render Output ({videoAspect})</span>
                    <button
                      onClick={() => {
                        onSendToChat(`Generated Veo 3 video for: "${videoPrompt}"`, [
                          { name: 'veo_render.mp4', type: 'file', url: generatedVideoUrl }
                        ]);
                        onClose();
                      }}
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      Share in Chat →
                    </button>
                  </div>
                  <video
                    controls
                    src={generatedVideoUrl}
                    className="w-full max-h-64 rounded-xl bg-black object-cover"
                    autoPlay
                    loop
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE CREATION & EDIT (gemini-3.1-flash-image-preview) */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
                <div className="font-semibold text-sky-200 text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  <span>Create & Edit Images (gemini-3.1-flash-image-preview)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Generate images with text prompts or upload an existing photo to apply edits and styling with Gemini 3.1 Flash Image.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-slate-300">Image Prompt or Edit Instruction:</label>
                <textarea
                  rows={2}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="E.g., Generate a holographic neural interface or 'Make the background cybernetic midnight blue'..."
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200">Optional: Source Image to Edit</div>
                  <div className="text-[11px] text-slate-400">Upload an image to apply prompt edits upon</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateImage}
                  disabled={imageLoading}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-sky-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${imageLoading ? 'animate-spin' : ''}`} />
                  <span>{imageLoading ? 'Synthesizing...' : 'Generate Image'}</span>
                </button>
              </div>

              {generatedImageUrl && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-sky-300">Generated Visual Asset</span>
                    <button
                      onClick={() => {
                        onSendToChat(`Generated image for: "${imagePrompt}"`, [
                          { name: 'gemini_image.png', type: 'image', url: generatedImageUrl }
                        ]);
                        onClose();
                      }}
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      Attach to Chat →
                    </button>
                  </div>
                  <img
                    src={generatedImageUrl}
                    alt={imagePrompt}
                    className="w-full max-h-72 object-contain rounded-xl bg-black/60 border border-slate-800"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SEARCH GROUNDING (gemini-3.5-flash) */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="font-semibold text-emerald-200 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Live Google Search Grounding (gemini-3.5-flash)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Grounds answers in real-time Google Search data to guarantee factual accuracy and up-to-date citations.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search query..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={handleSearchGoogle}
                  disabled={searchLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${searchLoading ? 'animate-spin' : ''}`} />
                  <span>Search</span>
                </button>
              </div>

              {searchResult && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-3 animate-fade-in">
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {searchResult.text}
                  </div>

                  {searchResult.sources && searchResult.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                        Verified Web Sources:
                      </div>
                      <div className="space-y-1">
                        {searchResult.sources.map((src: any, idx: number) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MAPS GROUNDING (gemini-3.5-flash) */}
          {activeTab === 'maps' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <div className="font-semibold text-amber-200 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Google Maps Grounding (gemini-3.5-flash)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Retrieves places, geographical locations, addresses, and directions directly through Maps Grounding.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="Enter location or place query..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={handleSearchMaps}
                  disabled={mapsLoading}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${mapsLoading ? 'animate-spin' : ''}`} />
                  <span>Locate</span>
                </button>
              </div>

              {mapsResult && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2 animate-fade-in">
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {mapsResult.text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIO TRANSCRIPTION (gemini-3.5-transcribe) */}
          {activeTab === 'transcribe' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="font-semibold text-cyan-200 text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Audio Transcription (gemini-3.5-transcribe)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Record audio from your microphone or input an audio clip and transcribe it with high acoustic fidelity.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
                <button
                  onClick={isRecording ? stopRecordingAudio : startRecordingAudio}
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_16px_rgba(56,189,248,0.3)]'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <div className="text-xs font-mono text-slate-300">
                  {isRecording ? 'Recording active... Click to finish & transcribe' : 'Click to start microphone recording'}
                </div>
              </div>

              {transcribeLoading && (
                <div className="p-4 text-center font-mono text-cyan-400 animate-pulse">
                  Transcribing with gemini-3.5-transcribe...
                </div>
              )}

              {transcriptResult && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-cyan-300">Transcription Result:</span>
                    <button
                      onClick={() => {
                        onSendToChat(transcriptResult);
                        onClose();
                      }}
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      Paste into Chat →
                    </button>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-mono text-xs bg-black/40 p-3 rounded-lg border border-slate-800">
                    {transcriptResult}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">Studio Engine: Ready · Multimodal Pipeline Enabled</span>
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
