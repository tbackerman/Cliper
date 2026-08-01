import React from 'react';
import { 
  Sparkles, 
  Video, 
  Cloud, 
  Share2, 
  BarChart3, 
  CheckCircle2, 
  Flame,
  HardDrive
} from 'lucide-react';
import { SocialAccount } from '../types';

interface NavbarProps {
  activeTab: 'clipper' | 'editor' | 'cloud' | 'publisher' | 'analytics';
  setActiveTab: (tab: 'clipper' | 'editor' | 'cloud' | 'publisher' | 'analytics') => void;
  socialAccounts: SocialAccount[];
  cloudStorageUsedMb: number;
  cloudStorageMaxMb: number;
  onOpenSocialConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  socialAccounts,
  cloudStorageUsedMb,
  cloudStorageMaxMb,
  onOpenSocialConnect,
}) => {
  const tiktokAcc = socialAccounts.find((a) => a.platform === 'tiktok');
  const igAcc = socialAccounts.find((a) => a.platform === 'instagram');

  const storagePercentage = Math.min(100, Math.round((cloudStorageUsedMb / cloudStorageMaxMb) * 100));

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('clipper')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">ClipViral</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-medium">Short Video & Auto Publisher</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              id="nav-tab-clipper"
              onClick={() => setActiveTab('clipper')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'clipper'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Clipper</span>
            </button>

            <button
              id="nav-tab-editor"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Studio Editor</span>
            </button>

            <button
              id="nav-tab-cloud"
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'cloud'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Storage</span>
            </button>

            <button
              id="nav-tab-publisher"
              onClick={() => setActiveTab('publisher')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'publisher'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Auto Publisher</span>
            </button>

            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analitik</span>
            </button>
          </nav>

          {/* Right Controls: Cloud Status & Account APIs */}
          <div className="flex items-center space-x-3">
            
            {/* Cloud Storage Usage Widget */}
            <div 
              id="cloud-storage-gauge" 
              className="hidden lg:flex flex-col cursor-pointer bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
              onClick={() => setActiveTab('cloud')}
              title="Kapasitas Cloud Storage Klip Video"
            >
              <div className="flex items-center justify-between space-x-2 text-[11px] mb-1">
                <span className="flex items-center text-slate-400 font-medium">
                  <HardDrive className="w-3 h-3 mr-1 text-cyan-400" /> Cloud Sync
                </span>
                <span className="text-slate-200 font-semibold">{cloudStorageUsedMb.toFixed(1)} MB / {(cloudStorageMaxMb / 1024).toFixed(0)} GB</span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            </div>

            {/* Social Direct API Integrations Badge */}
            <button
              id="btn-social-connect-modal"
              onClick={onOpenSocialConnect}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg transition"
              title="Status Integrasi Direct API TikTok & Instagram"
            >
              <div className="flex items-center -space-x-1">
                <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-teal-300">
                  TT
                </div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                  IG
                </div>
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>API Linked</span>
                </div>
              </div>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Toolbar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('clipper')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeTab === 'clipper' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>AI Clip</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeTab === 'editor' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4 mb-0.5" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeTab === 'cloud' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Cloud className="w-4 h-4 mb-0.5" />
          <span>Cloud</span>
        </button>
        <button
          onClick={() => setActiveTab('publisher')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeTab === 'publisher' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Share2 className="w-4 h-4 mb-0.5" />
          <span>Publish</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeTab === 'analytics' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Analitik</span>
        </button>
      </div>
    </header>
  );
};
