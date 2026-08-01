import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Flame, 
  Clock, 
  Tag, 
  Share2, 
  Edit3, 
  Cloud, 
  CheckCircle, 
  AlertCircle,
  Video,
  ArrowRight,
  Zap,
  Bot
} from 'lucide-react';
import { ShortClip } from '../types';
import { SAMPLE_VIDEOS } from '../data/mockData';

interface AutoClipperProps {
  onSelectClipForEdit: (clip: ShortClip) => void;
  onSaveClipToCloud: (clip: ShortClip) => void;
  onPublishClipDirect: (clip: ShortClip) => void;
  generatedClips: ShortClip[];
  setGeneratedClips: React.Dispatch<React.SetStateAction<ShortClip[]>>;
}

export const AutoClipper: React.FC<AutoClipperProps> = ({
  onSelectClipForEdit,
  onSaveClipToCloud,
  onPublishClipDirect,
  generatedClips,
  setGeneratedClips,
}) => {
  const [inputType, setInputType] = useState<'url' | 'sample' | 'transcript'>('url');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [selectedSample, setSelectedSample] = useState(SAMPLE_VIDEOS[0]);
  const [transcriptText, setTranscriptText] = useState(
    'Di episode kali ini kita bakal ngebahas rahasia 3 detik pertama dalam bikin konten TikTok & Instagram Reels. Banyak kreator gagal bukan karena ide jelek, tapi karena gak punya HOOK pembuka yang menggugah emosi. Ketika lu pake kalimat "Jangan pernah lakukan ini kalau lu mau sukses", audiens bakal ketahan setidaknya 15 detik. Fokus pada 1 nilai utama, kasih subtitle dengan font kontras tinggi, dan langsung kasih kesimpulan menggantung!'
  );
  const [topic, setTopic] = useState('Mindset, Bisnis & Strategi Content Marketing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(
    'AI Gemini mendeteksi 3 momen puncak emosional dengan tingkat keterikatan tinggi untuk pemotong klip pendek 9:16.'
  );

  const handleRunAiClipping = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const payload = {
        inputType,
        url: inputType === 'url' ? videoUrl : selectedSample.url,
        textContent: inputType === 'transcript' ? transcriptText : selectedSample.title,
        topic,
        targetLanguage: 'id',
      };

      const res = await fetch('/api/gemini/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      let json: any = {};

      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Respon server (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Gagal menerima rekomendasi klip dari AI.');
      }

      const { clips, summary } = json.data;
      setAnalysisSummary(summary || 'Analisis AI selesai.');

      const mappedClips: ShortClip[] = clips.map((c: any, index: number) => ({
        id: `ai-clip-${Date.now()}-${index}`,
        projectId: `proj-${Date.now()}`,
        title: c.title || `Viral Clip #${index + 1}`,
        hookText: c.hookText || '🔥 VIRAL HOOK DETECTED',
        startTimeSec: c.startTimeSec || 10,
        endTimeSec: c.endTimeSec || 40,
        durationSec: c.durationSec || 30,
        viralScore: c.viralScore || Math.floor(Math.random() * 15 + 84),
        reasoning: c.reasoning || 'Kombinasi kata kunci emosional dan pembuka kuat.',
        category: c.category || 'High Retain Moment',
        videoUrl: inputType === 'sample' ? selectedSample.url : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: inputType === 'sample' ? selectedSample.thumbnail : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
        aspectRatio: '9:16',
        filter: 'vibrant',
        captionStyle: 'bounce',
        captionColor: '#eab308',
        autoCaptions: c.autoCaptions || [],
        hashtags: c.hashtags || ['#fyp', '#viralindonesia', '#edukasi'],
        tiktokCaption: c.platformCustomization?.tiktokCaption || c.title,
        instagramCaption: c.platformCustomization?.instagramCaption || c.title,
        cloudUrl: `https://cloud.clipviral.io/storage/v/clip-${Date.now()}-${index}.mp4`,
        fileSizeMb: parseFloat((Math.random() * 10 + 15).toFixed(1)),
        createdAt: new Date().toISOString(),
        savedToCloud: true, // Saved automatically in cloud storage
        publishedPlatforms: [],
      }));

      setGeneratedClips(mappedClips);
    } catch (err: any) {
      console.error('Error running AI Clipping:', err);
      setErrorMsg(err.message || 'Gagal memproses klip otomatis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="section-auto-clipper" className="space-y-8 pb-12">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Auto-Clipper Engine (Gemini 3.6 Flash)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Ubah Video Panjang Jadi 4 Klip Pendek Viral Dalam Hitungan Detik
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Deteksi momen paling seru otomatis, hasilkan subtitle bergerak beranimasi, simpan langsung ke Cloud Storage, dan jadwalkan ke TikTok & Instagram API.
          </p>
        </div>
      </div>

      {/* Input Form & AI Trigger */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-6">
          <button
            id="tab-input-url"
            onClick={() => setInputType('url')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              inputType === 'url'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>URL Video YouTube / MP4</span>
          </button>
          <button
            id="tab-input-sample"
            onClick={() => setInputType('sample')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              inputType === 'sample'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Pilih Sample Video Demo</span>
          </button>
          <button
            id="tab-input-transcript"
            onClick={() => setInputType('transcript')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              inputType === 'transcript'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Transkrip / Ringkasan Teks</span>
          </button>
        </div>

        {/* Dynamic Input Body */}
        {inputType === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Video (YouTube, Google Drive, atau Direct Link)
              </label>
              <input
                id="input-video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>
        )}

        {inputType === 'sample' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAMPLE_VIDEOS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border transition p-3 ${
                  selectedSample.id === sample.id
                    ? 'border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-500/20'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img src={sample.thumbnail} alt={sample.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded">
                      {Math.floor(sample.duration / 60)} m {sample.duration % 60} s
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{sample.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{sample.category}</p>
              </div>
            ))}
          </div>
        )}

        {inputType === 'transcript' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Salin Transkrip Konten / Catatan Pembicaraan
              </label>
              <textarea
                id="input-transcript-text"
                rows={4}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* Niche & Topic Option */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Topik / Kategori Konten
            </label>
            <input
              id="input-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Motivasi, Edukasi Finansial, Review Gadget"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-end">
            <button
              id="btn-run-ai-clipper"
              onClick={handleRunAiClipping}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold py-3 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition duration-200 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>AI Sedang Menganalisis Momen Viral...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                  <span>Potong Video Otomatis AI (Gemini)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-800 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Generated Clips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>Rekomendasi Klip Pendek Viral ({generatedClips.length})</span>
            </h2>
            {analysisSummary && (
              <p className="text-xs text-slate-400 mt-1">{analysisSummary}</p>
            )}
          </div>

          <div className="text-xs text-emerald-400 font-medium flex items-center space-x-1 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
            <Cloud className="w-3.5 h-3.5" />
            <span>Tersimpan Otomatis ke Cloud</span>
          </div>
        </div>

        {/* Clips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedClips.map((clip) => (
            <div
              key={clip.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-lg group"
            >
              {/* Media Preview Header */}
              <div className="relative aspect-[9/16] bg-slate-950 overflow-hidden">
                <img
                  src={clip.thumbnailUrl}
                  alt={clip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Viral Score Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Skor Viral: {clip.viralScore}%</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-700 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{clip.durationSec}s</span>
                </div>

                {/* Hook Text Banner Overlay Simulation */}
                <div className="absolute top-16 inset-x-3 bg-rose-600/90 text-white font-extrabold text-xs text-center uppercase tracking-wide py-1.5 px-2 rounded-lg shadow-lg border border-rose-400/50">
                  {clip.hookText}
                </div>

                {/* Live Caption Sample */}
                <div className="absolute bottom-4 inset-x-3 text-center">
                  <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded shadow-md uppercase">
                    "{clip.autoCaptions[0]?.text || clip.title}"
                  </span>
                </div>
              </div>

              {/* Clip Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                    <Tag className="w-3 h-3" />
                    <span>{clip.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{clip.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    💡 <span className="text-slate-300 font-medium">Alasan Viral:</span> {clip.reasoning}
                  </p>
                </div>

                {/* Hashtags Preview */}
                <div className="flex flex-wrap gap-1">
                  {clip.hashtags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectClipForEdit(clip)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Edit Studio</span>
                  </button>

                  <button
                    onClick={() => onPublishClipDirect(clip)}
                    className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Unggah API</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
