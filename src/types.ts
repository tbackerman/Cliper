export type AspectRatio = '9:16' | '1:1' | '16:9';

export type VideoFilter = 'none' | 'vibrant' | 'cinematic' | 'vintage' | 'contrast' | 'warm';

export type CaptionStyle = 'bounce' | 'neon' | 'bold-subtitle' | 'clean' | 'box';

export interface AutoCaptionItem {
  start: number; // in seconds
  end: number;
  text: string;
  highlight?: boolean;
}

export interface ShortClip {
  id: string;
  projectId: string;
  title: string;
  hookText: string;
  startTimeSec: number;
  endTimeSec: number;
  durationSec: number;
  viralScore: number; // 0 - 100
  reasoning: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: AspectRatio;
  filter: VideoFilter;
  captionStyle: CaptionStyle;
  captionColor: string;
  autoCaptions: AutoCaptionItem[];
  hashtags: string[];
  tiktokCaption: string;
  instagramCaption: string;
  cloudUrl: string;
  fileSizeMb: number;
  createdAt: string;
  savedToCloud: boolean;
  publishedPlatforms: ('tiktok' | 'instagram' | 'youtube')[];
  viewsCount?: number;
  likesCount?: number;
}

export interface VideoProject {
  id: string;
  title: string;
  originalVideoUrl: string;
  sourceType: 'youtube' | 'upload' | 'url' | 'sample';
  durationTotalSec: number;
  thumbnailUrl: string;
  createdAt: string;
  clipsCount: number;
  status: 'analyzed' | 'processing' | 'draft';
}

export interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  handle: string;
  displayName: string;
  avatarUrl: string;
  followersCount: number;
  connected: boolean;
  tokenExpiry: string;
  status: 'active' | 'reauth_required' | 'disconnected';
  publishedCount: number;
}

export interface PublishedPost {
  id: string;
  clipId: string;
  clipTitle: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  postId: string;
  shareUrl: string;
  caption: string;
  hashtags: string[];
  publishedAt: string;
  isScheduled: boolean;
  scheduledTime?: string;
  status: 'published' | 'scheduled' | 'uploading' | 'failed';
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    watchTimeAvgSec: number;
  };
}

export interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  avgWatchTimePercent: number;
  viralScoreAvg: number;
  platformBreakdown: {
    tiktok: { views: number; percentage: number };
    instagram: { views: number; percentage: number };
    youtube: { views: number; percentage: number };
  };
  monthlyGrowthPercent: number;
}
