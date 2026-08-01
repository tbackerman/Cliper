import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Scissors, 
  Type, 
  Palette, 
  Sparkles, 
  Cloud, 
  Share2, 
  Save, 
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ShortClip, AspectRatio, VideoFilter, CaptionStyle, AutoCaptionItem } from '../types';

interface VideoEditorProps {
  clip: ShortClip | null;
  onSaveClip: (updatedClip: ShortClip) => void;
  onPublishClip: (clip: ShortClip) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  clip,
  onSaveClip,
  onPublishClip,
}) => {
  if (!clip) {
    return (
      <div id="section-editor-empty" className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <Scissors className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">Belum Ada Klip Yang Dipilih</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Silakan pilih klip dari tab <strong className="text-rose-400">AI Clipper</strong> atau <strong className="text-cyan-400">Cloud Storage</strong> untuk mulai mengedit subtitle, pemotongan durasi, dan filter.
        </p>
      </div>
    );
  }

  const [currentClip, setCurrentClip] = useState<ShortClip>(clip);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'trim' | 'subtitles' | 'hook' | 'filters' | 'overlays'>('trim');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentClip(clip);
  }, [clip]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    // Loop clip within trim range
    if (videoRef.current.currentTime >= currentClip.endTimeSec) {
      videoRef.current.currentTime = currentClip.startTimeSec;
    }
  };

  const handleTrimChange = (start: number, end: number) => {
    const durationSec = Math.max(5, Math.round(end - start));
    const updated = { ...currentClip, startTimeSec: start, endTimeSec: end, durationSec };
    setCurrentClip(updated);
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
  };

  const handleAddCaption = () => {
    const newCaption: AutoCaptionItem = {
      start: Math.round(currentTime),
      end: Math.round(currentTime + 4),
      text: 'Teks Subtitle Baru',
      highlight: false,
    };
    setCurrentClip({
      ...currentClip,
      autoCaptions: [...currentClip.autoCaptions, newCaption],
    });
  };

  const handleUpdateCaption = (index: number, text: string) => {
    const updated = [...currentClip.autoCaptions];
    updated[index].text = text;
    setCurrentClip({ ...currentClip, autoCaptions: updated });
  };

  const handleDeleteCaption = (index: number) => {
    const updated = currentClip.autoCaptions.filter((_, i) => i !== index);
    setCurrentClip({ ...currentClip, autoCaptions: updated });
  };

  const handleSaveToCloud = () => {
    onSaveClip(currentClip);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  // Find active subtitle text for live preview
  const activeCaption = currentClip.autoCaptions.find(
    (c) => currentTime >= c.start && currentTime <= c.end
  ) || currentClip.autoCaptions[0];

  // Helper CSS class for video filter preset
  const getFilterClass = (filter: VideoFilter) => {
    switch (filter) {
      case 'vibrant':
        return 'saturate-150 contrast-110 brightness-105';
      case 'cinematic':
        return 'contrast-125 brightness-95 sepia-[0.15] hue-rotate-15';
      case 'vintage':
        return 'grayscale contrast-120';
      case 'contrast':
        return 'contrast-150 saturate-125';
      case 'warm':
        return 'sepia-[0.25] saturate-120 brightness-105';
      default:
        return '';
    }
  };

  return (
    <div id="section-studio-editor" className="space-y-6 pb-12">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            Studio Editor 9:16
          </span>
          <h2 className="text-lg font-bold text-white mt-1 line-clamp-1">{currentClip.title}</h2>
        </div>

        <div className="flex items-center space-x-3">
          {showSavedNotification && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan di Cloud!</span>
            </div>
          )}

          <button
            id="btn-editor-save-cloud"
            onClick={handleSaveToCloud}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-2 transition border border-slate-700"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Simpan Cloud</span>
          </button>

          <button
            id="btn-editor-publish"
            onClick={() => onPublishClip(currentClip)}
            className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold py-2 px-4 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-rose-600/20 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Unggah API</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Preview Canvas, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Video Canvas Preview (9:16 vertical ratio centered) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex flex-col justify-between">
            
            {/* Video Element */}
            <video
              ref={videoRef}
              src={currentClip.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              className={`w-full h-full object-cover ${getFilterClass(currentClip.filter)}`}
              playsInline
              loop
            />

            {/* Hook Banner Text Overlay (Top) */}
            {currentClip.hookText && (
              <div className="absolute top-6 inset-x-4 z-20 text-center">
                <div className="bg-rose-600 text-white font-extrabold text-xs uppercase px-3 py-2 rounded-xl shadow-2xl border border-rose-400/50 animate-pulse tracking-wide">
                  {currentClip.hookText}
                </div>
              </div>
            )}

            {/* Subtitle Caption Overlay (Bottom) */}
            <div className="absolute bottom-16 inset-x-4 z-20 text-center pointer-events-none">
              {activeCaption && (
                <div
                  className={`inline-block px-3 py-1.5 rounded-lg text-sm font-extrabold uppercase shadow-2xl transition duration-150 ${
                    currentClip.captionStyle === 'bounce'
                      ? 'scale-105 animate-bounce'
                      : currentClip.captionStyle === 'neon'
                      ? 'drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                      : 'bg-slate-950/90 border border-slate-700'
                  }`}
                  style={{ color: currentClip.captionColor }}
                >
                  {activeCaption.text}
                </div>
              )}
            </div>

            {/* Video Controls Bar Overlay */}
            <div className="absolute bottom-3 inset-x-3 z-30 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <div className="text-[11px] font-mono font-bold text-slate-300">
                {currentTime.toFixed(1)}s / {currentClip.durationSec}s
              </div>

              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white p-1"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 mt-3 font-medium text-center">
            Format Preview: <span className="text-white font-semibold">9:16 Vertical Shorts/Reels/TikTok</span>
          </p>
        </div>

        {/* Right Editor Controls Sidebar */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Editor Control Tabs */}
          <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('trim')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'trim'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Trim Durasi</span>
            </button>

            <button
              onClick={() => setActiveTab('subtitles')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'subtitles'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Gaya Subtitle</span>
            </button>

            <button
              onClick={() => setActiveTab('hook')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'hook'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hook Banner</span>
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'filters'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Filter Visual</span>
            </button>
          </div>

          {/* TAB 1: TRIM DURASI */}
          {activeTab === 'trim' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Scissors className="w-4 h-4 text-rose-400" />
                <span>Pengaturan Timeline & Range Trim</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                    <span>Detik Mulai: <strong className="text-amber-400">{currentClip.startTimeSec}s</strong></span>
                    <span>Detik Selesai: <strong className="text-amber-400">{currentClip.endTimeSec}s</strong></span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400">Start Time (sec)</label>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(10, currentClip.endTimeSec - 5)}
                        value={currentClip.startTimeSec}
                        onChange={(e) => handleTrimChange(Number(e.target.value), currentClip.endTimeSec)}
                        className="w-full accent-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">End Time (sec)</label>
                      <input
                        type="range"
                        min={currentClip.startTimeSec + 5}
                        max={300}
                        value={currentClip.endTimeSec}
                        onChange={(e) => handleTrimChange(currentClip.startTimeSec, Number(e.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">Total Durasi Klip Terpotong:</span>
                  <span className="text-sm font-extrabold text-amber-400 font-mono">{currentClip.durationSec} Detik</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBTITLE & CAPTION STYLES */}
          {activeTab === 'subtitles' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Type className="w-4 h-4 text-rose-400" />
                <span>Kustomisasi Tipografi Auto-Subtitle AI</span>
              </h3>

              {/* Caption Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Animasi Subtitle</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bounce', 'neon', 'bold-subtitle', 'clean'] as CaptionStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setCurrentClip({ ...currentClip, captionStyle: style })}
                      className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition ${
                        currentClip.captionStyle === style
                          ? 'border-rose-500 bg-rose-950/40 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Color Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Warna Teks Highlight</label>
                <div className="flex items-center space-x-3">
                  {[
                    { name: 'Kuning', hex: '#eab308' },
                    { name: 'Sian', hex: '#06b6d4' },
                    { name: 'Hijau', hex: '#22c55e' },
                    { name: 'Putih', hex: '#ffffff' },
                    { name: 'Merah', hex: '#f43f5e' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setCurrentClip({ ...currentClip, captionColor: color.hex })}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        currentClip.captionColor === color.hex ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Subtitle Line List */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Daftar Baris Subtitle</span>
                  <button
                    onClick={handleAddCaption}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentClip.autoCaptions.map((cap, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 w-10">{cap.start}s</span>
                      <input
                        type="text"
                        value={cap.text}
                        onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeleteCaption(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOOK BANNER OVERLAY */}
          {activeTab === 'hook' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Pengaturan Hook Banner Atas</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teks Hook Atas Video</label>
                <input
                  type="text"
                  value={currentClip.hookText}
                  onChange={(e) => setCurrentClip({ ...currentClip, hookText: e.target.value })}
                  placeholder="Contoh: ⚠️ JANGAN SKIP VIDEO INI!"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-bold uppercase"
                />
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL FILTERS */}
          {activeTab === 'filters' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Palette className="w-4 h-4 text-rose-400" />
                <span>Preset Filter Visual</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'none', label: 'Original Normal' },
                  { id: 'vibrant', label: 'Vibrant Pop 🔥' },
                  { id: 'cinematic', label: 'Cinematic Mood 🎬' },
                  { id: 'vintage', label: 'Vintage B&W 📽️' },
                  { id: 'contrast', label: 'High Contrast⚡' },
                  { id: 'warm', label: 'Warm Glow ☀️' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCurrentClip({ ...currentClip, filter: f.id as VideoFilter })}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      currentClip.filter === f.id
                        ? 'border-rose-500 bg-rose-950/40 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
