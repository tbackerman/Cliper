import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AutoClipper } from './components/AutoClipper';
import { VideoEditor } from './components/VideoEditor';
import { CloudStorageGallery } from './components/CloudStorageGallery';
import { SocialPublisher } from './components/SocialPublisher';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SocialConnectModal } from './components/SocialConnectModal';

import { ShortClip, SocialAccount, PublishedPost, AnalyticsOverview } from './types';
import {
  INITIAL_CLIPS,
  INITIAL_SOCIAL_ACCOUNTS,
  INITIAL_PUBLISHED_POSTS,
  INITIAL_ANALYTICS,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'clipper' | 'editor' | 'cloud' | 'publisher' | 'analytics'>('clipper');

  // Load persistent state from localStorage if present
  const [clips, setClips] = useState<ShortClip[]>(() => {
    const saved = localStorage.getItem('clipviral_clips');
    return saved ? JSON.parse(saved) : INITIAL_CLIPS;
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('clipviral_social_accounts');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_ACCOUNTS;
  });

  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(() => {
    const saved = localStorage.getItem('clipviral_published_posts');
    return saved ? JSON.parse(saved) : INITIAL_PUBLISHED_POSTS;
  });

  const [analytics, setAnalytics] = useState<AnalyticsOverview>(INITIAL_ANALYTICS);

  const [selectedClipForEdit, setSelectedClipForEdit] = useState<ShortClip | null>(clips[0] || null);
  const [selectedClipForPublish, setSelectedClipForPublish] = useState<ShortClip | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('clipviral_clips', JSON.stringify(clips));
  }, [clips]);

  useEffect(() => {
    localStorage.setItem('clipviral_social_accounts', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  useEffect(() => {
    localStorage.setItem('clipviral_published_posts', JSON.stringify(publishedPosts));
  }, [publishedPosts]);

  // Calculate total storage used in MB
  const cloudStorageUsedMb = clips.reduce((sum, c) => sum + (c.fileSizeMb || 18.5), 0);
  const cloudStorageMaxMb = 10240; // 10 GB

  // Handlers
  const handleSelectClipForEdit = (clip: ShortClip) => {
    setSelectedClipForEdit(clip);
    setActiveTab('editor');
  };

  const handlePublishClipDirect = (clip: ShortClip) => {
    setSelectedClipForPublish(clip);
    setActiveTab('publisher');
  };

  const handleSaveClip = (updatedClip: ShortClip) => {
    setClips((prev) => {
      const exists = prev.some((c) => c.id === updatedClip.id);
      if (exists) {
        return prev.map((c) => (c.id === updatedClip.id ? updatedClip : c));
      }
      return [updatedClip, ...prev];
    });
    setSelectedClipForEdit(updatedClip);
  };

  const handleDeleteClip = (clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    if (selectedClipForEdit?.id === clipId) {
      setSelectedClipForEdit(clips.find((c) => c.id !== clipId) || null);
    }
  };

  const handleAddPublishedPost = (newPost: PublishedPost) => {
    setPublishedPosts((prev) => [newPost, ...prev]);
    // update analytics counters
    setAnalytics((prev) => ({
      ...prev,
      totalViews: prev.totalViews + 1,
    }));
  };

  const handleUpdateAccountStatus = (accountId: string, connected: boolean) => {
    setSocialAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, connected } : acc))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        socialAccounts={socialAccounts}
        cloudStorageUsedMb={cloudStorageUsedMb}
        cloudStorageMaxMb={cloudStorageMaxMb}
        onOpenSocialConnect={() => setIsSocialModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'clipper' && (
          <AutoClipper
            onSelectClipForEdit={handleSelectClipForEdit}
            onSaveClipToCloud={handleSaveClip}
            onPublishClipDirect={handlePublishClipDirect}
            generatedClips={clips}
            setGeneratedClips={setClips}
          />
        )}

        {activeTab === 'editor' && (
          <VideoEditor
            clip={selectedClipForEdit}
            onSaveClip={handleSaveClip}
            onPublishClip={handlePublishClipDirect}
          />
        )}

        {activeTab === 'cloud' && (
          <CloudStorageGallery
            clips={clips}
            cloudStorageUsedMb={cloudStorageUsedMb}
            cloudStorageMaxMb={cloudStorageMaxMb}
            onSelectClipForEdit={handleSelectClipForEdit}
            onPublishClipDirect={handlePublishClipDirect}
            onDeleteClip={handleDeleteClip}
          />
        )}

        {activeTab === 'publisher' && (
          <SocialPublisher
            clips={clips}
            socialAccounts={socialAccounts}
            publishedPosts={publishedPosts}
            onAddPublishedPost={handleAddPublishedPost}
            selectedClipForPublish={selectedClipForPublish}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={analytics}
            publishedPosts={publishedPosts}
            clips={clips}
          />
        )}
      </main>

      {/* Social Accounts Direct API Connections Modal */}
      <SocialConnectModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        accounts={socialAccounts}
        onUpdateAccountStatus={handleUpdateAccountStatus}
      />
    </div>
  );
}
