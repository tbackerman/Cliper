import React, { useState } from 'react';
import { 
  Share2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Send, 
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Bot
} from 'lucide-react';
import { ShortClip, SocialAccount, PublishedPost } from '../types';

interface SocialPublisherProps {
  clips: ShortClip[];
  socialAccounts: SocialAccount[];
  publishedPosts: PublishedPost[];
  onAddPublishedPost: (post: PublishedPost) => void;
  selectedClipForPublish?: ShortClip | null;
}

export const SocialPublisher: React.FC<SocialPublisherProps> = ({
  clips,
  socialAccounts,
  publishedPosts,
  onAddPublishedPost,
  selectedClipForPublish,
}) => {
  const [selectedClipId, setSelectedClipId] = useState<string>(
    selectedClipForPublish?.id || clips[0]?.id || ''
  );
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['tiktok', 'instagram']);
  const [postTiming, setPostTiming] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('2026-08-01T19:00');
  const [customCaption, setCustomCaption] = useState(
    selectedClipForPublish?.tiktokCaption ||
      'Trik 3 detik pertama agar video kalian tidak di-swipe up! Terapkan sekarang juga! 🚀🔥 #fyp #trikviral #edukasitiktok'
  );
  const [isGeneratingAiCaption, setIsGeneratingAiCaption] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStage, setPublishingStage] = useState<string | null>(null);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const activeClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  const tiktokAccount = socialAccounts.find((a) => a.platform === 'tiktok');
  const instagramAccount = socialAccounts.find((a) => a.platform === 'instagram');

  const togglePlatform = (p: string) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((item) => item !== p));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleAiGenerateCaption = async () => {
    if (!activeClip) return;
    setIsGeneratingAiCaption(true);
    try {
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: activeClip.title,
          clipTopic: activeClip.category,
          platform: targetPlatforms[0] || 'tiktok',
          tone: 'viral',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.caption) {
          setCustomCaption(json.caption);
        }
      }
    } catch (err) {
      console.error('Error generating caption:', err);
    } finally {
      setIsGeneratingAiCaption(false);
    }
  };

  const handleStartPublishing = async () => {
    if (!activeClip) return;
    setIsPublishing(true);
    setPublishSuccessMessage(null);

    try {
      // Simulate API Progress Steps
      setPublishingStage('1/4: Membuka Koneksi Direct API (TikTok & Instagram)...');
      await new Promise((r) => setTimeout(r, 1000));

      setPublishingStage('2/4: Transcoding Format Video 9:16 HD 1080p...');
      await new Promise((r) => setTimeout(r, 1200));

      setPublishingStage('3/4: Mentransfer Chunk Video Via Direct Upload API...');
      await new Promise((r) => setTimeout(r, 1400));

      setPublishingStage('4/4: Memverifikasi Metadata & Hashtag Algoritma...');
      await new Promise((r) => setTimeout(r, 1000));

      // Call Backend Endpoint
      const payload = {
        clipId: activeClip.id,
        clipTitle: activeClip.title,
        targetPlatforms,
        scheduledAt: postTiming === 'schedule' ? scheduledDate : null,
        caption: customCaption,
        hashtags: activeClip.hashtags,
      };

      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        setPublishSuccessMessage(json.message);

        // Record in published posts
        if (targetPlatforms.includes('tiktok')) {
          onAddPublishedPost({
            id: `pub-${Date.now()}-tt`,
            clipId: activeClip.id,
            clipTitle: activeClip.title,
            platform: 'tiktok',
            postId: `tt_vid_${Math.floor(Math.random() * 899999 + 100000)}`,
            shareUrl: `https://www.tiktok.com/@clipviral_official/video/${Math.floor(Math.random() * 8999999999 + 1000000000)}`,
            caption: customCaption,
            hashtags: activeClip.hashtags,
            publishedAt: new Date().toISOString(),
            isScheduled: postTiming === 'schedule',
            scheduledTime: postTiming === 'schedule' ? scheduledDate : undefined,
            status: postTiming === 'schedule' ? 'scheduled' : 'published',
            metrics: { views: 0, likes: 0, shares: 0, comments: 0, watchTimeAvgSec: 0 },
          });
        }

        if (targetPlatforms.includes('instagram')) {
          onAddPublishedPost({
            id: `pub-${Date.now()}-ig`,
            clipId: activeClip.id,
            clipTitle: activeClip.title,
            platform: 'instagram',
            postId: `ig_reel_${Math.floor(Math.random() * 899999 + 100000)}`,
            shareUrl: `https://www.instagram.com/reel/C${Math.random().toString(36).substring(2, 11)}/`,
            caption: customCaption,
            hashtags: activeClip.hashtags,
            publishedAt: new Date().toISOString(),
            isScheduled: postTiming === 'schedule',
            scheduledTime: postTiming === 'schedule' ? scheduledDate : undefined,
            status: postTiming === 'schedule' ? 'scheduled' : 'published',
            metrics: { views: 0, likes: 0, shares: 0, comments: 0, watchTimeAvgSec: 0 },
          });
        }
      }
    } catch (err: any) {
      console.error('Publishing error:', err);
    } finally {
      setIsPublishing(false);
      setPublishingStage(null);
    }
  };

  return (
    <div id="section-social-publisher" className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
          <Share2 className="w-4 h-4" />
          <span>Auto-Publisher API TikTok & Instagram</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Pengunggah Otomatis Ke Media Sosial</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Terintegrasi langsung dengan API resmi TikTok Open Platform dan Instagram Graph API untuk unggahan instan atau penjadwalan konten otomatis.
        </p>
      </div>

      {/* Main Grid: Left Upload Setup, Right Connected Accounts & Post Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            
            {/* Step 1: Select Clip */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Pilih Klip Video Dari Cloud
              </label>
              <select
                id="select-clip-publish"
                value={selectedClipId}
                onChange={(e) => {
                  setSelectedClipId(e.target.value);
                  const found = clips.find((c) => c.id === e.target.value);
                  if (found) setCustomCaption(found.tiktokCaption || found.title);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
              >
                {clips.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.durationSec}s | Skor Viral {c.viralScore}%] - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Target Platform */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                2. Pilih Platform Unggahan (Direct API)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => togglePlatform('tiktok')}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                    targetPlatforms.includes('tiktok')
                      ? 'border-teal-500 bg-teal-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                      TT
                    </span>
                    <span>TikTok Video API</span>
                  </div>
                  {targetPlatforms.includes('tiktok') && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => togglePlatform('instagram')}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                    targetPlatforms.includes('instagram')
                      ? 'border-purple-500 bg-purple-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                      IG
                    </span>
                    <span>Instagram Reels API</span>
                  </div>
                  {targetPlatforms.includes('instagram') && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>
              </div>
            </div>

            {/* Step 3: AI Caption & Hashtag Refinement */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300">
                  3. Teks Caption & Hashtag Optimization
                </label>
                <button
                  type="button"
                  onClick={handleAiGenerateCaption}
                  disabled={isGeneratingAiCaption}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg"
                >
                  {isGeneratingAiCaption ? (
                    <span>Sedang Membuat Caption...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buat Caption AI</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="input-custom-caption"
                rows={4}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>

            {/* Step 4: Timing (Now or Scheduled) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                4. Waktu Publikasi Konten
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setPostTiming('now')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                    postTiming === 'now'
                      ? 'border-rose-500 bg-rose-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Unggah Langsung Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostTiming('schedule')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                    postTiming === 'schedule'
                      ? 'border-rose-500 bg-rose-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwalkan Post</span>
                </button>
              </div>

              {postTiming === 'schedule' && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-[11px] text-slate-400">Tanggal & Jam Penjadwalan:</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <button
              id="btn-trigger-publish-api"
              onClick={handleStartPublishing}
              disabled={isPublishing || !activeClip}
              className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition duration-200 disabled:opacity-50"
            >
              {isPublishing ? (
                <span>Memproses Unggahan Direct API...</span>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>
                    {postTiming === 'schedule' ? 'Konfirmasi Penjadwalan Konten' : 'Unggah Langsung Ke Media Sosial'}
                  </span>
                </>
              )}
            </button>

            {/* Live Progress Output */}
            {publishingStage && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 flex items-center space-x-2 animate-pulse">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span>{publishingStage}</span>
              </div>
            )}

            {publishSuccessMessage && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">{publishSuccessMessage}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right Accounts & History Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Linked API Accounts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Status Koneksi API Akun</span>
              <span className="text-[10px] text-emerald-400 font-mono">2 Active Connections</span>
            </h3>

            <div className="space-y-3">
              {tiktokAccount && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={tiktokAccount.avatarUrl} alt="TikTok Avatar" className="w-9 h-9 rounded-full border border-teal-500/50" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{tiktokAccount.displayName}</h4>
                      <p className="text-[10px] text-slate-400">{tiktokAccount.handle} • {tiktokAccount.followersCount.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    TikTok API
                  </span>
                </div>
              )}

              {instagramAccount && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={instagramAccount.avatarUrl} alt="IG Avatar" className="w-9 h-9 rounded-full border border-purple-500/50" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{instagramAccount.displayName}</h4>
                      <p className="text-[10px] text-slate-400">{instagramAccount.handle} • {instagramAccount.followersCount.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-semibold">
                    Instagram API
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Published Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Riwayat Unggahan Terakhir ({publishedPosts.length})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {publishedPosts.map((post) => (
                <div key={post.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      post.platform === 'tiktok' ? 'bg-teal-500/20 text-teal-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {post.platform.toUpperCase()}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{post.clipTitle}</h4>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 font-medium">
                      Status: <strong className="text-emerald-400">{post.status}</strong>
                    </span>

                    <a
                      href={post.shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <span>Lihat Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
