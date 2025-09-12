import React, { useMemo } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import StoriesBar from './StoriesBar';
import { useCommunity } from '@/contexts/CommunityContext';

const CommunityFeed: React.FC = () => {
  const { posts } = useCommunity();
  const feed = useMemo(() => posts
    .filter(p => p.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [posts]);

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <StoriesBar />
      <CreatePost />
      {feed.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No posts yet. Be the first to share your eco-action!</div>
      ) : (
        feed.map(p => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
};

export default CommunityFeed;
