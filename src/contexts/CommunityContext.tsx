import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export type MediaType = 'image' | 'video';

export interface UserSummary {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface CommentItem {
  id: string;
  user: UserSummary;
  text: string;
  createdAt: string;
}

export interface PostItem {
  id: string;
  user: UserSummary;
  mediaUrl: string; // data URL for now
  mediaType: MediaType;
  caption: string;
  tags: string[];
  likes: string[]; // user ids
  comments: CommentItem[];
  createdAt: string;
  approved: boolean;
  flaggedReason?: string;
}

interface CommunityContextValue {
  posts: PostItem[];
  addPost: (input: { mediaUrl: string; mediaType: MediaType; caption: string; tags: string[] }) => { approved: boolean; reason?: string };
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  currentUser?: UserSummary | null;
}

const CommunityContext = createContext<CommunityContextValue | undefined>(undefined);

const STORAGE_KEY = 'communityPosts_v1';

const ENV_KEYWORDS = [
  'tree', 'trees', 'plant', 'planting', 'sapling', 'recycle', 'recycling', 'cleanup', 'clean-up', 'clean up', 'beach cleanup',
  'plastic-free', 'plastic free', 'compost', 'composting', 'sustainability', 'sustainable', 'renewable', 'solar', 'wind', 'bicycle',
  'bike', 'cycle', 'cycling', 'carpool', 'wildlife', 'conservation', 'river clean', 'river cleanup', 'greenery', 'garden', 'gardening',
  'biodiversity', 'zero waste', 'ewaste', 'e-waste', 'energy saving', 'water saving', 'rainwater', 'harvesting', 'eco', 'environment',
  '#treeplanting', '#cleanupdrive', '#recycling', '#ecopoints', '#sustainability', '#green'
];

function isEnvironmentalContent(caption: string, tags: string[]): boolean {
  const hay = `${caption} ${tags.join(' ')}`.toLowerCase();
  return ENV_KEYWORDS.some(k => hay.includes(k));
}

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [posts, setPosts] = useState<PostItem[]>([]);

  const currentUser: UserSummary | null = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: profile?.full_name || user.email || 'User',
      avatarUrl: (profile as any)?.pokemonAvatar || null,
    };
  }, [user, profile]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PostItem[];
        setPosts(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const addPost = useCallback<CommunityContextValue['addPost']>((input) => {
    if (!currentUser) return { approved: false, reason: 'Not authenticated' };

    const approved = isEnvironmentalContent(input.caption, input.tags);
    const newPost: PostItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: currentUser,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      caption: input.caption,
      tags: input.tags,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      approved,
      flaggedReason: approved ? undefined : 'Post does not appear to be related to environmental activities.'
    };
    setPosts(prev => [newPost, ...prev]);
    return approved ? { approved: true } : { approved: false, reason: newPost.flaggedReason };
  }, [currentUser]);

  const likePost = useCallback((postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => p.id === postId && !p.likes.includes(currentUser.id)
      ? { ...p, likes: [...p.likes, currentUser.id] } : p));
  }, [currentUser]);

  const unlikePost = useCallback((postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, likes: p.likes.filter(id => id !== currentUser.id) } : p));
  }, [currentUser]);

  const addComment = useCallback((postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const comment: CommentItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      user: currentUser,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  }, [currentUser]);

  const value: CommunityContextValue = {
    posts,
    addPost,
    likePost,
    unlikePost,
    addComment,
    currentUser,
  };

  return (
    <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};
