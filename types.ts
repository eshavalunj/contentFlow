
export type Platform = 'Twitter' | 'Instagram' | 'LinkedIn';

export type AppView = 'DASHBOARD' | 'CAMPAIGNS' | 'SCHEDULE' | 'SETTINGS';

export type PostStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'SCHEDULED';

export interface PostVersion {
  id: string;
  label: string;
  content: string;
  imageDescription: string;
  imageUrl?: string;
  isApproved: boolean;
  scheduledDates: string[];
}

export interface SocialPost {
  id: string;
  platform: Platform;
  versions: PostVersion[];
}

export interface ContentTheme {
  id: string;
  title: string;
  rationale: string;
  posts: SocialPost[];
}

export interface Campaign {
  id: string;
  name: string;
  intent: string;
  sourceText: string;
  themes: ContentTheme[];
  createdAt: number;
}

export interface UserSettings {
  twitterConnected: boolean;
  linkedinConnected: boolean;
  instagramConnected: boolean;
}

export enum AppStep {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  REVIEW = 'REVIEW',
  SCHEDULE = 'SCHEDULE',
  EXPORT = 'EXPORT'
}
