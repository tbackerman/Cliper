import React, { useState } from 'react';
import { 
  Cloud, 
  HardDrive, 
  Play, 
  Download, 
  Share2, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Folder, 
  Clock, 
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ShortClip } from '../types';

interface CloudStorageGalleryProps {
  clips: ShortClip[];
  cloudStorageUsedMb: number;
  cloudStorageMaxMb: number;
  onSelectClipForEdit: (clip: ShortClip) => void;
  onPublishClipDirect: (clip: ShortClip) => void;
  onDeleteClip: (clipId: string) => void;
}

export const CloudStorageGallery: React.FC<CloudStorageGalleryProps> = ({
  clips,
  cloudStorageUsedMb,
  cloudStorageMaxMb,
  onSelectClipForEdit,
  onPublishClipDirect,
  onDeleteClip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedClipId, setCopiedClipId] = useState<string | null>(null);
  const [previewClip, setPreviewClip] = useState<ShortClip | null>(null);

  const categories = ['all', ...Array.from(new Set(clips.map((c) => c.category)))];

  const filteredClips = clips.filter((clip) => {
    const matchesSearch = clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          clip.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || clip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCloudUrl = (clip: ShortClip) => {
    navigator.clipboard.writeText(clip.cloudUrl);
    setCopiedClipId(clip.id);
    setTimeout(() => setCopiedClipId(null), 2000);
  };

  const handleDownloadMp4 = (clip: ShortClip) => {
    const a = document.createElement('a');
    a.href = clip.videoUrl;
    a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const storagePercentage = Math.min(100, Math.round((cloudStorageUsedMb / cloudStorageMaxMb) * 100));

  return (
    <div id="section-cloud-gallery" className="space-y-8 pb-12">
      
      {/* Cloud Header & Storage Capacity Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Cloud className="w-4 h-4 animate-bounce" />
              <span>Penyimpanan Cloud Otomatis</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active Sync
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Galeri Klip Cloud Siap Pakai</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Setiap klip yang dibuat oleh AI otomatis diunggah dan disimpan ke server Cloud Storage agar bisa diakses kapan saja, dari perangkat apa saja secara instan.
            </p>
          </div>

          {/* Capacity Gauge Box */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl w-full md:w-72 shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center text-slate-300">
                <HardDrive className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Kapasitas Digunakan
              </span>
              <span className="text-white font-mono">{cloudStorageUsedMb.toFixed(1)} MB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{clips.length} Klip Tersimpan</span>
              <span>Batas: {(cloudStorageMaxMb / 1024).toFixed(0)} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="input-search-cloud"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari klip berdasarkan judul atau hashtag..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua Klip' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredClips.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Folder className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold">Tidak ada klip video yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map((clip) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Cloud Sync Status Badge */}
                <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center space-x-1 shadow">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Synced ({clip.fileSizeMb} MB)</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-slate-900/90 text-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-700 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{clip.durationSec}s</span>
                </div>

                {/* Play Stream Trigger Button Overlay */}
                <button
                  onClick={() => setPreviewClip(clip)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition duration-200 scale-90 group-hover:scale-100"
                  title="Putar Streaming Video"
                >
                  <Play className="w-6 h-6 ml-1" />
                </button>
              </div>

              {/* Details & Fast Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {clip.category}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-2 mt-0.5">{clip.title}</h3>
                </div>

                {/* Fast Action Buttons Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectClipForEdit(clip)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-center space-x-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Edit Studio</span>
                    </button>

                    <button
                      onClick={() => onPublishClipDirect(clip)}
                      className="bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-center space-x-1 shadow transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Auto Publish</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleCopyCloudUrl(clip)}
                      className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition"
                    >
                      {copiedClipId === clip.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">URL Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Tautan Cloud</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadMp4(clip)}
                        className="p-1 text-slate-400 hover:text-white transition"
                        title="Unduh MP4"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteClip(clip.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Hapus dari Cloud"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Streaming Preview Modal */}
      {previewClip && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-4 relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white line-clamp-1">{previewClip.title}</h3>
              <button
                onClick={() => setPreviewClip(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Tutup ✕
              </button>
            </div>

            <div className="aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden">
              <video
                src={previewClip.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  onSelectClipForEdit(previewClip);
                  setPreviewClip(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-xl text-xs"
              >
                Buka di Editor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
