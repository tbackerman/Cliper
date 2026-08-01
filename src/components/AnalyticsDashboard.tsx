import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Share2, 
  Heart, 
  Flame, 
  Sparkles, 
  Clock, 
  Award,
  Users,
  PieChart
} from 'lucide-react';
import { AnalyticsOverview, PublishedPost, ShortClip } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsOverview;
  publishedPosts: PublishedPost[];
  clips: ShortClip[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  publishedPosts,
  clips,
}) => {
  // Sort top performing clips by views / viral score
  const topClips = [...clips].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  return (
    <div id="section-analytics-dashboard" className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Analitik Performa Konten Mendalam</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard Statistik & Retensi Penonton</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Pantau jumlah penonton, tingkat konversi viral, durasi retensi audiens, serta perbandingan performa antara TikTok dan Instagram Reels.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Penonton (Views)</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {(analytics.totalViews / 1000000).toFixed(2)}M
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +{analytics.monthlyGrowthPercent}% bulan ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Rata-Rata Retensi</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.avgWatchTimePercent}%
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Retensi &gt; 70% Sangat Viral
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Suka (Likes)</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {(analytics.totalLikes / 1000).toFixed(1)}K
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> High Engagement
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Rata-Rata Skor Viral</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.viralScoreAvg}/100
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center mt-1">
              <Flame className="w-3 h-3 mr-1 text-amber-400" /> Ditenagai AI Gemini
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* AI Performance Strategic Insight Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-300 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Rekomendasi Strategi AI Gemini Untuk Konten Berikutnya:</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Klip dengan <strong className="text-amber-300">Subtitle Beranimasi Bounce Kuning</strong> dan durasi di bawah <strong className="text-cyan-300">35 detik</strong> di TikTok terbukti menghasilkan <strong className="text-emerald-400">42% lebih banyak pembagian (shares)</strong> dibanding video tanpa hook visual.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-semibold whitespace-nowrap">
          Jam Rame: <span className="text-amber-400 font-bold">18:00 - 20:30 WIB</span>
        </div>
      </div>

      {/* Platform Breakdown & Retention Visual Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Platform Share (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Distribusi Penonton Berdasarkan Platform</span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </h3>

          <div className="space-y-4">
            {/* TikTok Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-teal-400">TikTok ({analytics.platformBreakdown.tiktok.percentage}%)</span>
                <span className="text-slate-300 font-mono">{(analytics.platformBreakdown.tiktok.views / 1000).toFixed(0)}K views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-teal-500 h-3 rounded-full"
                  style={{ width: `${analytics.platformBreakdown.tiktok.percentage}%` }}
                />
              </div>
            </div>

            {/* Instagram Reels Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-purple-400">Instagram Reels ({analytics.platformBreakdown.instagram.percentage}%)</span>
                <span className="text-slate-300 font-mono">{(analytics.platformBreakdown.instagram.views / 1000).toFixed(0)}K views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: `${analytics.platformBreakdown.instagram.percentage}%` }}
                />
              </div>
            </div>

            {/* YouTube Shorts Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-400">YouTube Shorts ({analytics.platformBreakdown.youtube.percentage}%)</span>
                <span className="text-slate-300 font-mono">{(analytics.platformBreakdown.youtube.views / 1000).toFixed(0)}K views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-3 rounded-full"
                  style={{ width: `${analytics.platformBreakdown.youtube.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audience Retention Curve Visual (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Kurva Retensi Penonton (% Penonton Tersisa)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </h3>

          {/* Simulated Retention Curve Bars */}
          <div className="space-y-3 pt-2">
            {[
              { time: '0s - 3s (Hook Initial)', pct: 98, note: 'Hook Sangat Kuat' },
              { time: '3s - 10s (Inti Cerita)', pct: 86, note: 'Penonton Bertahan' },
              { time: '10s - 25s (Klimaks Diskusi)', pct: 74, note: 'Engaged' },
              { time: '25s - 35s (Call To Action)', pct: 68, note: 'Tingkat Konversi Tinggi' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{step.time}</span>
                  <span className="text-amber-400 font-bold font-mono">{step.pct}% Penonton</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 h-2.5 rounded-full"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Performing Clips Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Peringkat Klip Video Paling Viral</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Diurutkan berdasarkan Total Views</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3 pl-2">Klip Video</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Skor Viral</th>
                <th className="pb-3">Total Views</th>
                <th className="pb-3">Suka (Likes)</th>
                <th className="pb-3 pr-2 text-right">Status Cloud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {topClips.map((clip, index) => (
                <tr key={clip.id} className="hover:bg-slate-950/50 transition">
                  <td className="py-3 pl-2">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{index + 1}
                      </span>
                      <img src={clip.thumbnailUrl} alt={clip.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{clip.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{clip.durationSec}s</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                      {clip.category}
                    </span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center space-x-1 font-bold text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{clip.viralScore}%</span>
                    </div>
                  </td>

                  <td className="py-3 font-mono font-bold text-white">
                    {((clip.viewsCount || 350000) / 1000).toFixed(0)}K
                  </td>

                  <td className="py-3 font-mono text-slate-300">
                    {((clip.likesCount || 42000) / 1000).toFixed(1)}K
                  </td>

                  <td className="py-3 pr-2 text-right">
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-semibold">
                      Cloud Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
